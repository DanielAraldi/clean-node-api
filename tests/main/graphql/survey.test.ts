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

describe('Survey GraphQL', () => {
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

  describe('Surveys Query', () => {
    const query = `query {
      surveys {
        id
        question
        answers {
          image
          answer
          answerId
        }
        date
        didAnswer
      }
    }`;

    test('Should return Surveys', async () => {
      const accessToken = await makeAccessToken();
      const now = new Date();
      const firstAnswerId = MongoHelper.objectId().toString();
      const secondAnswerId = MongoHelper.objectId().toString();
      await surveyCollection.insertOne({
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
      const response = await request(app)
        .post('/api/graphql')
        .set('x-access-token', accessToken)
        .send({ query });
      expect(response.status).toBe(200);
      expect(response.body.data.surveys.length).toBe(1);
      expect(response.body.data.surveys[0].id).toBeTruthy();
      expect(response.body.data.surveys[0].question).toBe('Question');
      expect(response.body.data.surveys[0].date).toBe(now.toISOString());
      expect(response.body.data.surveys[0].didAnswer).toBe(false);
      expect(response.body.data.surveys[0].answers).toEqual([
        {
          answerId: firstAnswerId,
          answer: 'Answer 1',
          image: 'http://image-name.com',
        },
        {
          answerId: secondAnswerId,
          answer: 'Answer 2',
          image: null,
        },
      ]);
    });

    test('Should return AccessDeniedError if no access token is provided', async () => {
      const firstAnswerId = MongoHelper.objectId().toString();
      const secondAnswerId = MongoHelper.objectId().toString();
      await surveyCollection.insertOne({
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
      const response = await request(app).post('/api/graphql').send({
        query,
      });
      expect(response.status).toBe(403);
      expect(response.body.data).toBeFalsy();
      expect(response.body.errors[0].message).toBe('Access denied');
    });
  });
});
