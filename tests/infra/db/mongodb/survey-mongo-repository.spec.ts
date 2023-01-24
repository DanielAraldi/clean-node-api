import { SurveyMongoRepository, MongoHelper } from '@/infra/db';
import {
  mockAddSurveyParams,
  mockAddAccountParams,
  mockSurveysModels,
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

const makeSut = (): SurveyMongoRepository => new SurveyMongoRepository();

describe('SurveyMongoRepository', () => {
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

  describe('add()', () => {
    test('Should add a survey on success', async () => {
      const sut = makeSut();
      await sut.add(mockAddSurveyParams());
      const count = await surveyCollection.countDocuments();
      expect(count).toBe(1);
    });
  });

  describe('loadAll()', () => {
    test('Should load all surveys on success', async () => {
      const sut = makeSut();
      const accountId = await mockAccountId();
      const addSurveyModels = mockSurveysModels();
      const surveysInserteds = await surveyCollection.insertMany(
        addSurveyModels
      );
      const surveyId = surveysInserteds.insertedIds[0];
      const survey = await surveyCollection.findOne({ _id: surveyId });
      await surveyResultCollection.insertOne({
        accountId: MongoHelper.objectId(accountId),
        surveyId: survey._id,
        answerId: survey.answers[0].answerId,
        date: new Date(),
      });
      const surveys = await sut.loadAll(accountId);
      expect(surveys.length).toBe(2);
      expect(surveys[0].id).toBeTruthy();
      expect(surveys[0].question).toBe(addSurveyModels[0].question);
      expect(surveys[0].didAnswer).toBe(true);
      expect(surveys[1].question).toBe(addSurveyModels[1].question);
      expect(surveys[1].didAnswer).toBe(false);
    });

    test('Should load empty list', async () => {
      const sut = makeSut();
      const accountId = await mockAccountId();
      const surveys = await sut.loadAll(accountId);
      expect(surveys.length).toBe(0);
    });
  });

  describe('loadById()', () => {
    test('Should return null if survey is not exists', async () => {
      const sut = makeSut();
      const surveyId = MongoHelper.objectId();
      const survey = await sut.loadById(surveyId.toString());
      expect(survey).toBeNull();
    });

    test('Should load survey by id on success', async () => {
      const collection = await surveyCollection.insertOne(
        mockAddSurveyParams()
      );
      const sut = makeSut();
      const surveyId = collection.insertedId.toString();
      const survey = await sut.loadById(surveyId);
      expect(survey).toBeTruthy();
      expect(survey.id).toBeTruthy();
    });
  });

  describe('checkById()', () => {
    test('Should return false if survey is not exists', async () => {
      const sut = makeSut();
      const surveyId = MongoHelper.objectId();
      const exists = await sut.checkById(surveyId.toString());
      expect(exists).toBe(false);
    });

    test('Should return true if survey exists', async () => {
      const collection = await surveyCollection.insertOne(
        mockAddSurveyParams()
      );
      const sut = makeSut();
      const surveyId = collection.insertedId.toString();
      const exists = await sut.checkById(surveyId);
      expect(exists).toBe(true);
    });
  });
});
