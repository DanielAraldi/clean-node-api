import { SurveyResultMongoRepository, MongoHelper } from '@/infra/db';
import { SurveyModel } from '@/domain/models';
import {
  mockAddSurveyParams,
  mockAddAccountParams,
} from '@/../tests/domain/mocks';

import { Collection } from 'mongodb';

let surveyCollection: Collection;
let surveyResultCollection: Collection;
let accountCollection: Collection;

const mockAccountId = async (): Promise<string> => {
  const insertedAccount = await accountCollection.insertOne(
    mockAddAccountParams()
  );
  return insertedAccount.insertedId.toString();
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
      const accountId = await mockAccountId();
      await sut.save({
        accountId,
        surveyId: survey.id,
        answerId: survey.answers[0].answerId,
        date: new Date(),
      });
      const surveyResult = await surveyResultCollection.findOne({
        surveyId: MongoHelper.objectId(survey.id),
        accountId: MongoHelper.objectId(accountId),
      });
      expect(surveyResult).toBeTruthy();
    });

    test('Should update survey result if its not new', async () => {
      const sut = makeSut();
      const survey = await mockSurvey();
      const accountId = await mockAccountId();
      await surveyResultCollection.insertOne({
        surveyId: MongoHelper.objectId(survey.id),
        accountId: MongoHelper.objectId(accountId),
        answerId: survey.answers[0].answerId,
        date: new Date(),
      });
      await sut.save({
        accountId,
        surveyId: survey.id,
        answerId: survey.answers[1].answerId,
        date: new Date(),
      });
      const surveyResult = await surveyResultCollection
        .find({
          surveyId: MongoHelper.objectId(survey.id),
          accountId: MongoHelper.objectId(accountId),
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
      const firstAccountId = await mockAccountId();
      const secondAccountId = await mockAccountId();
      await surveyResultCollection.insertMany([
        {
          surveyId: MongoHelper.objectId(survey.id),
          accountId: MongoHelper.objectId(secondAccountId),
          answerId: survey.answers[0].answerId,
          date: new Date(),
        },
        {
          surveyId: MongoHelper.objectId(survey.id),
          accountId: MongoHelper.objectId(firstAccountId),
          answerId: survey.answers[0].answerId,
          date: new Date(),
        },
      ]);
      const surveyResult = await sut.loadBySurveyId(survey.id, firstAccountId);
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
      const firstAccountId = await mockAccountId();
      const secondAccountId = await mockAccountId();
      const thirdAccountId = await mockAccountId();
      await surveyResultCollection.insertMany([
        {
          surveyId: MongoHelper.objectId(survey.id),
          accountId: MongoHelper.objectId(firstAccountId),
          answerId: survey.answers[0].answerId,
          date: new Date(),
        },
        {
          surveyId: MongoHelper.objectId(survey.id),
          accountId: MongoHelper.objectId(secondAccountId),
          answerId: survey.answers[1].answerId,
          date: new Date(),
        },
        {
          surveyId: MongoHelper.objectId(survey.id),
          accountId: MongoHelper.objectId(thirdAccountId),
          answerId: survey.answers[1].answerId,
          date: new Date(),
        },
      ]);
      const surveyResult = await sut.loadBySurveyId(survey.id, secondAccountId);
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
      const firstAccountId = await mockAccountId();
      const secondAccountId = await mockAccountId();
      const thirdAccountId = await mockAccountId();
      await surveyResultCollection.insertMany([
        {
          surveyId: MongoHelper.objectId(survey.id),
          accountId: MongoHelper.objectId(firstAccountId),
          answerId: survey.answers[0].answerId,
          date: new Date(),
        },
        {
          surveyId: MongoHelper.objectId(survey.id),
          accountId: MongoHelper.objectId(secondAccountId),
          answerId: survey.answers[1].answerId,
          date: new Date(),
        },
      ]);
      const surveyResult = await sut.loadBySurveyId(survey.id, thirdAccountId);
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
      const accountId = await mockAccountId();
      const surveyResult = await sut.loadBySurveyId(survey.id, accountId);
      expect(surveyResult).toBeNull();
    });
  });
});
