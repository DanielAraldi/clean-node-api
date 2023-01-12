import {
  SurveyModel,
  AccountModel,
} from './survey-result-mongo-repository-protocols';
import { MongoHelper } from '../helpers';
import { SurveyResultMongoRepository } from './survey-result-mongo-repository';
import { mockAddSurveyParams, mockAddAccountParams } from '@/domain/tests';
import { Collection } from 'mongodb';

let surveyCollection: Collection;
let surveyResultCollection: Collection;
let accountCollection: Collection;

const mockAccount = async (): Promise<AccountModel> => {
  const insertedAccount = await accountCollection.insertOne(
    mockAddAccountParams()
  );
  const account = await accountCollection.findOne({
    _id: insertedAccount.insertedId,
  });
  return MongoHelper.assign<AccountModel>(account);
};

const mockSurvey = async (): Promise<SurveyModel> => {
  const addSurveyParams = mockAddSurveyParams();
  const insertedSurvey = await surveyCollection.insertOne({
    ...addSurveyParams,
    answers: addSurveyParams.answers.map(answer =>
      Object.assign({}, answer, { answerId: MongoHelper.objectId() })
    ),
  });
  const survey = await surveyCollection.findOne({
    _id: insertedSurvey.insertedId,
  });
  return MongoHelper.assign<SurveyModel>(survey);
};

const makeSut = (): SurveyResultMongoRepository =>
  new SurveyResultMongoRepository();

describe('SurveyResultMongoRepository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL || '');
  });

  afterAll(async () => {
    await MongoHelper.disconnect();
  });

  beforeEach(async () => {
    surveyCollection = await MongoHelper.getCollection('surveys');
    await surveyCollection.deleteMany({});
    surveyResultCollection = await MongoHelper.getCollection('surveyResults');
    await surveyResultCollection.deleteMany({});
    accountCollection = await MongoHelper.getCollection('accounts');
    await accountCollection.deleteMany({});
  });

  describe('save()', () => {
    test('Should add a survey result if its new', async () => {
      const sut = makeSut();
      const survey = await mockSurvey();
      const account = await mockAccount();
      await sut.save({
        surveyId: survey.id,
        accountId: account.id,
        answerId: survey.answers[0].answerId,
        date: new Date(),
      });
      const surveyResult = await surveyResultCollection.findOne({
        surveyId: MongoHelper.objectId(survey.id),
        accountId: MongoHelper.objectId(account.id),
      });
      expect(surveyResult).toBeTruthy();
    });

    test('Should update survey result if its not new', async () => {
      const sut = makeSut();
      const survey = await mockSurvey();
      const account = await mockAccount();
      await surveyResultCollection.insertOne({
        surveyId: MongoHelper.objectId(survey.id),
        accountId: MongoHelper.objectId(account.id),
        answerId: survey.answers[0].answerId,
        date: new Date(),
      });
      await sut.save({
        surveyId: survey.id,
        accountId: account.id,
        answerId: survey.answers[1].answerId,
        date: new Date(),
      });
      const surveyResult = await surveyResultCollection
        .find({
          surveyId: MongoHelper.objectId(survey.id),
          accountId: MongoHelper.objectId(account.id),
        })
        .toArray();
      expect(surveyResult).toBeTruthy();
      expect(surveyResult.length).toBe(1);
    });
  });

  describe('loadBySurveyId()', () => {
    test('Should load survey result with two users', async () => {
      const sut = makeSut();
      const survey = await mockSurvey();
      const firstAccount = await mockAccount();
      const secondAccount = await mockAccount();
      await surveyResultCollection.insertMany([
        {
          surveyId: MongoHelper.objectId(survey.id),
          accountId: MongoHelper.objectId(secondAccount.id),
          answerId: survey.answers[0].answerId,
          date: new Date(),
        },
        {
          surveyId: MongoHelper.objectId(survey.id),
          accountId: MongoHelper.objectId(firstAccount.id),
          answerId: survey.answers[0].answerId,
          date: new Date(),
        },
      ]);
      const surveyResult = await sut.loadBySurveyId(survey.id, firstAccount.id);
      expect(surveyResult).toBeTruthy();
      expect(surveyResult.surveyId).toEqual(survey.id);
      expect(surveyResult.answers[0].count).toBe(2);
      expect(surveyResult.answers[0].percent).toBe(100);
      expect(surveyResult.answers[0].isCurrentAccountAnswer).toBe(true);
      expect(surveyResult.answers[1].count).toBe(0);
      expect(surveyResult.answers[1].percent).toBe(0);
      expect(surveyResult.answers[1].isCurrentAccountAnswer).toBe(false);
      expect(surveyResult.answers.length).toBe(survey.answers.length);
    });

    test('Should load survey result with three users', async () => {
      const sut = makeSut();
      const survey = await mockSurvey();
      const firstAccount = await mockAccount();
      const secondAccount = await mockAccount();
      const thirdAccount = await mockAccount();
      await surveyResultCollection.insertMany([
        {
          surveyId: MongoHelper.objectId(survey.id),
          accountId: MongoHelper.objectId(firstAccount.id),
          answerId: survey.answers[0].answerId,
          date: new Date(),
        },
        {
          surveyId: MongoHelper.objectId(survey.id),
          accountId: MongoHelper.objectId(secondAccount.id),
          answerId: survey.answers[1].answerId,
          date: new Date(),
        },
        {
          surveyId: MongoHelper.objectId(survey.id),
          accountId: MongoHelper.objectId(thirdAccount.id),
          answerId: survey.answers[1].answerId,
          date: new Date(),
        },
      ]);
      const surveyResult = await sut.loadBySurveyId(
        survey.id,
        secondAccount.id
      );
      expect(surveyResult).toBeTruthy();
      expect(surveyResult.surveyId).toEqual(survey.id);
      expect(surveyResult.answers[0].count).toBe(2);
      expect(surveyResult.answers[0].percent).toBe(67);
      expect(surveyResult.answers[0].isCurrentAccountAnswer).toBe(true);
      expect(surveyResult.answers[1].count).toBe(1);
      expect(surveyResult.answers[1].percent).toBe(33);
      expect(surveyResult.answers[1].isCurrentAccountAnswer).toBe(false);
      expect(surveyResult.answers.length).toBe(survey.answers.length);
    });

    test('Should load survey result with third user no answers', async () => {
      const sut = makeSut();
      const survey = await mockSurvey();
      const firstAccount = await mockAccount();
      const secondAccount = await mockAccount();
      const thirdAccount = await mockAccount();
      await surveyResultCollection.insertMany([
        {
          surveyId: MongoHelper.objectId(survey.id),
          accountId: MongoHelper.objectId(firstAccount.id),
          answerId: survey.answers[0].answerId,
          date: new Date(),
        },
        {
          surveyId: MongoHelper.objectId(survey.id),
          accountId: MongoHelper.objectId(secondAccount.id),
          answerId: survey.answers[1].answerId,
          date: new Date(),
        },
      ]);
      const surveyResult = await sut.loadBySurveyId(survey.id, thirdAccount.id);
      expect(surveyResult).toBeTruthy();
      expect(surveyResult.surveyId).toEqual(survey.id);
      expect(surveyResult.answers[0].count).toBe(1);
      expect(surveyResult.answers[0].percent).toBe(50);
      expect(surveyResult.answers[0].isCurrentAccountAnswer).toBe(false);
      expect(surveyResult.answers[1].count).toBe(1);
      expect(surveyResult.answers[1].percent).toBe(50);
      expect(surveyResult.answers[1].isCurrentAccountAnswer).toBe(false);
      expect(surveyResult.answers.length).toBe(survey.answers.length);
    });

    test("Should return null if survey result don't have answers", async () => {
      const sut = makeSut();
      const survey = await mockSurvey();
      const account = await mockAccount();
      const surveyResult = await sut.loadBySurveyId(survey.id, account.id);
      expect(surveyResult).toBeNull();
    });
  });
});
