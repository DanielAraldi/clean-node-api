import {
  SurveyModel,
  AccountModel,
} from './survey-result-mongo-repository-protocols';
import { MongoHelper } from '../helpers';
import { SurveyResultMongoRepository } from './survey-result-mongo-repository';
import { Collection } from 'mongodb';

let surveyCollection: Collection;
let surveyResultCollection: Collection;
let accountCollection: Collection;

const makeAccount = async (): Promise<AccountModel> => {
  const insertedAccount = await accountCollection.insertOne({
    name: 'any_name',
    email: 'any_email@mail.com',
    password: 'any_password',
  });
  const account = await accountCollection.findOne({
    _id: insertedAccount.insertedId,
  });
  return MongoHelper.assign<AccountModel>(account);
};

const makeSurvey = async (): Promise<SurveyModel> => {
  const insertedSurvey = await surveyCollection.insertOne({
    question: 'any_question',
    answers: [
      {
        answerId: MongoHelper.objectId(),
        image: 'any_image_1',
        answer: 'any_answer_1',
      },
      {
        answerId: MongoHelper.objectId(),
        answer: 'any_answer_2',
      },
      {
        answerId: MongoHelper.objectId(),
        answer: 'any_answer_3',
      },
    ],
    date: new Date(),
  });
  const survey = await surveyCollection.findOne({
    _id: insertedSurvey.insertedId,
  });
  return MongoHelper.assign<SurveyModel>(survey);
};

const makeSut = (): SurveyResultMongoRepository =>
  new SurveyResultMongoRepository();

describe('Survey Mongo Repository', () => {
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
      const survey = await makeSurvey();
      const account = await makeAccount();
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
      const survey = await makeSurvey();
      const account = await makeAccount();
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
    test('Should load survey result', async () => {
      const sut = makeSut();
      const survey = await makeSurvey();
      const account = await makeAccount();
      await surveyResultCollection.insertMany([
        {
          surveyId: MongoHelper.objectId(survey.id),
          accountId: MongoHelper.objectId(account.id),
          answerId: survey.answers[0].answerId,
          date: new Date(),
        },
        {
          surveyId: MongoHelper.objectId(survey.id),
          accountId: MongoHelper.objectId(account.id),
          answerId: survey.answers[0].answerId,
          date: new Date(),
        },
        {
          surveyId: MongoHelper.objectId(survey.id),
          accountId: MongoHelper.objectId(account.id),
          answerId: survey.answers[1].answerId,
          date: new Date(),
        },
        {
          surveyId: MongoHelper.objectId(survey.id),
          accountId: MongoHelper.objectId(account.id),
          answerId: survey.answers[1].answerId,
          date: new Date(),
        },
      ]);
      const surveyResult = await sut.loadBySurveyId(survey.id);
      expect(surveyResult).toBeTruthy();
      expect(surveyResult.surveyId).toEqual(survey.id);
      expect(surveyResult.answers[0].count).toBe(2);
      expect(surveyResult.answers[0].percent).toBe(50);
      expect(surveyResult.answers[1].count).toBe(2);
      expect(surveyResult.answers[1].percent).toBe(50);
      expect(surveyResult.answers[2].count).toBe(0);
      expect(surveyResult.answers[2].percent).toBe(0);
    });

    test("Should return null if survey result don't have answers", async () => {
      const sut = makeSut();
      const survey = await makeSurvey();
      const surveyResult = await sut.loadBySurveyId(survey.id);
      expect(surveyResult).toBeNull();
    });
  });
});
