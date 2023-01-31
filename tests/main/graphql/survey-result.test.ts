import { MongoHelper } from '@/infra/db';
import { Collection } from 'mongodb';
import { sign } from 'jsonwebtoken';
import request from 'supertest';
import app from '@/main/config/app';
import env from '@/main/config/env';

let accountCollection: Collection;
let surveyCollection: Collection;

const makeAccessToken = async (): Promise<string> => {
  const account = await accountCollection.insertOne({
    name: 'Daniel',
    email: 'daniel@gmail.com',
    password: '123',
    role: 'admin',
  });
  const id = account.insertedId;
  const accessToken = sign({ id }, env.jwtSecret);
  await accountCollection.updateOne({ _id: id }, { $set: { accessToken } });
  return accessToken;
};

describe('SurveyResult GraphQL', () => {
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

  describe('SurveyResult Query', () => {
    test('Should return SurveyResult', async () => {
      const accessToken = await makeAccessToken();
      const now = new Date();
      const firstAnswerId = MongoHelper.objectId().toString();
      const secondAnswerId = MongoHelper.objectId().toString();
      const survey = await surveyCollection.insertOne({
        question: 'Question',
        answers: [
          {
            answerId: firstAnswerId,
            answer: 'Answer 1',
            image: 'http://image-name.com',
          },
          {
            answerId: secondAnswerId,
            answer: 'Answer 2',
          },
        ],
        date: now,
      });
      const query = `query {
        surveyResult (surveyId: "${survey.insertedId.toString()}") {
          surveyId
          question
          answers {
            answerId
            answer
            count
            percent
            isCurrentAccountAnswer
          }
          date
        }
      }`;
      const response = await request(app)
        .post('/graphql')
        .set('x-access-token', accessToken)
        .send({ query });
      expect(response.status).toBe(200);
      expect(response.body.data.surveyResult.question).toBe('Question');
      expect(response.body.data.surveyResult.date).toBe(now.toISOString());
      expect(response.body.data.surveyResult.answers).toEqual([
        {
          answerId: firstAnswerId,
          answer: 'Answer 1',
          count: 0,
          percent: 0,
          isCurrentAccountAnswer: false,
        },
        {
          answerId: secondAnswerId,
          answer: 'Answer 2',
          count: 0,
          percent: 0,
          isCurrentAccountAnswer: false,
        },
      ]);
    });

    test('Should return AccessDeniedError if no access token is provided', async () => {
      const firstAnswerId = MongoHelper.objectId().toString();
      const secondAnswerId = MongoHelper.objectId().toString();
      const survey = await surveyCollection.insertOne({
        question: 'Question',
        answers: [
          {
            answerId: firstAnswerId,
            answer: 'Answer 1',
            image: 'http://image-name.com',
          },
          {
            answerId: secondAnswerId,
            answer: 'Answer 2',
          },
        ],
        date: new Date(),
      });
      const query = `query {
        surveyResult (surveyId: "${survey.insertedId.toString()}") {
          surveyId
          question
          answers {
            answerId
            answer
            count
            percent
            isCurrentAccountAnswer
          }
          date
        }
      }`;
      const response = await request(app).post('/graphql').send({ query });
      expect(response.status).toBe(403);
      expect(response.body.data).toBeFalsy();
      expect(response.body.errors[0].message).toBe('Access denied');
    });
  });

  describe('SaveSurveyResult Query', () => {
    test('Should return SurveyResult', async () => {
      const firstAnswerId = MongoHelper.objectId();
      const secondAnswerId = MongoHelper.objectId();
      const accessToken = await makeAccessToken();
      const now = new Date();
      const survey = await surveyCollection.insertOne({
        question: 'Question',
        answers: [
          {
            answerId: firstAnswerId,
            answer: 'Answer 1',
            image: 'http://image-name.com',
          },
          {
            answerId: secondAnswerId,
            answer: 'Answer 2',
          },
        ],
        date: now,
      });
      const query = `mutation {
        saveSurveyResult (surveyId: "${survey.insertedId.toString()}", answerId: "${firstAnswerId.toString()}") {
          surveyId
          question
          answers {
            answerId
            answer
            count
            percent
            isCurrentAccountAnswer
          }
          date
        }
      }`;
      const response = await request(app)
        .post('/graphql')
        .set('x-access-token', accessToken)
        .send({ query });
      expect(response.status).toBe(200);
      expect(response.body.data.saveSurveyResult.question).toBe('Question');
      expect(response.body.data.saveSurveyResult.date).toBe(now.toISOString());
      expect(response.body.data.saveSurveyResult.answers).toEqual([
        {
          answerId: firstAnswerId.toString(),
          answer: 'Answer 1',
          count: 1,
          percent: 100,
          isCurrentAccountAnswer: true,
        },
        {
          answerId: secondAnswerId.toString(),
          answer: 'Answer 2',
          count: 0,
          percent: 0,
          isCurrentAccountAnswer: false,
        },
      ]);
    });

    test('Should return AccessDeniedError if no access token is provided', async () => {
      const firstAnswerId = MongoHelper.objectId().toString();
      const secondAnswerId = MongoHelper.objectId().toString();
      const survey = await surveyCollection.insertOne({
        question: 'Question',
        answers: [
          {
            answerId: firstAnswerId.toString(),
            answer: 'Answer 1',
            image: 'http://image-name.com',
          },
          {
            answerId: secondAnswerId.toString(),
            answer: 'Answer 2',
          },
        ],
        date: new Date(),
      });
      const query = `mutation {
        saveSurveyResult (surveyId: "${survey.insertedId.toString()}", answerId: "${firstAnswerId.toString()}") {
          surveyId
          question
          answers {
            answerId
            answer
            count
            percent
            isCurrentAccountAnswer
          }
          date
        }
      }`;
      const response = await request(app).post('/graphql').send({ query });
      expect(response.status).toBe(403);
      expect(response.body.data).toBeFalsy();
      expect(response.body.errors[0].message).toBe('Access denied');
    });
  });
});
