import { MongoHelper } from '@/infra/db';
import { Collection } from 'mongodb';
import { ApolloServer } from '@apollo/server';
import { makeApolloServer } from './helpers';
import { sign } from 'jsonwebtoken';
import env from '@/main/config/env';

let accountCollection: Collection;
let surveyCollection: Collection;
let apolloServer: ApolloServer;

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
    apolloServer = makeApolloServer();
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
    const surveysQuery = `#graphql
      query surveys {
        surveys {
          id
          question
          answers {
            answerId
            answer
            image
          }
          date
          didAnswer
        }
      }
    `;

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
      const response: any = await apolloServer.executeOperation(
        {
          query: surveysQuery,
        },
        {
          contextValue: {
            req: {
              headers: {
                'x-access-token': accessToken,
              },
            },
          },
        }
      );
      expect(response.body.singleResult.data?.surveys.length).toBe(1);
      expect(response.body.singleResult.data?.surveys[0].id).toBeTruthy();
      expect(response.body.singleResult.data?.surveys[0].question).toBe(
        'Question'
      );
      expect(response.body.singleResult.data?.surveys[0].date).toBe(
        now.toISOString()
      );
      expect(response.body.singleResult.data?.surveys[0].didAnswer).toBe(false);
      expect(response.body.singleResult.data?.surveys[0].answers).toEqual([
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
      const response: any = await apolloServer.executeOperation({
        query: surveysQuery,
      });
      expect(response.body.singleResult.data).toBeFalsy();
      expect(response.body.singleResult.errors[0].message).toBe(
        'Access denied'
      );
    });
  });
});
