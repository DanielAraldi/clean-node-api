import { SurveyModel } from '@/domain/models';
import { MongoHelper } from '@/infra/db';
import env from '@/main/config/env';
import app from '@/main/config/app';
import { sign } from 'jsonwebtoken';
import { Collection } from 'mongodb';
import request from 'supertest';

let surveyCollection: Collection;
let accountCollection: Collection;

const mockSurvey = async (): Promise<SurveyModel> => {
  const insertedSurvey = await surveyCollection.insertOne({
    question: 'Question',
    answers: [
      {
        answerId: MongoHelper.objectId(),
        answer: 'Answer 1',
        image: 'http://image-name.com',
      },
      {
        answerId: MongoHelper.objectId(),
        answer: 'Answer 2',
        image: 'http://image-name.com',
      },
    ],
    date: new Date(),
  });
  const survey = await surveyCollection.findOne({
    _id: insertedSurvey.insertedId,
  });
  return MongoHelper.assign<SurveyModel>(survey);
};

const makeAccessToken = async (): Promise<string> => {
  const account = await accountCollection.insertOne({
    name: 'Daniel',
    email: 'daniel@gmail.com',
    password: '123',
  });
  const id = account.insertedId;
  const accessToken = sign({ id }, env.jwtSecret);
  await accountCollection.updateOne({ _id: id }, { $set: { accessToken } });
  return accessToken;
};

describe('SurveyResult Routes', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL || '');
  });

  afterAll(async () => {
    await MongoHelper.disconnect();
  });

  beforeEach(async () => {
    surveyCollection = await MongoHelper.getCollection('surveys');
    await surveyCollection.deleteMany({});
    accountCollection = await MongoHelper.getCollection('accounts');
    await accountCollection.deleteMany({});
  });

  describe('PUT /surveys/:surveyId/results', () => {
    test('Should return 403 on save survey result without accessToken', async () => {
      const survey = await mockSurvey();
      await request(app)
        .put('/api/surveys/any_id/results')
        .send({
          answerId: survey.answers[0].answerId.toString(),
        })
        .expect(403);
    });

    test('Should return 200 on save survey result with accessToken', async () => {
      const survey = await mockSurvey();
      const accessToken = await makeAccessToken();
      await request(app)
        .put(`/api/surveys/${survey.id}/results`)
        .set('x-access-token', accessToken)
        .send({
          answerId: survey.answers[0].answerId.toString(),
        })
        .expect(200);
    });
  });

  describe('GET /surveys/:surveyId/results', () => {
    test('Should return 403 on load survey result without accessToken', async () =>
      await request(app).get('/api/surveys/any_id/results').expect(403));

    test('Should return 200 on load survey result with accessToken', async () => {
      const survey = await mockSurvey();
      const accessToken = await makeAccessToken();
      await request(app)
        .get(`/api/surveys/${survey.id}/results`)
        .set('x-access-token', accessToken)
        .expect(200);
    });
  });
});
