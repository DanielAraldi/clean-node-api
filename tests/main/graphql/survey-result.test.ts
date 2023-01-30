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

describe('SurveyResult GraphQL', () => {
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

  describe('SurveyResult Query', () => {
    const surveyResultQuery = `#graphql
      query surveyResult ($surveyId: String!) {
        surveyResult (surveyId: $surveyId) {
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
      }
    `;

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
      const surveyId = survey.insertedId.toString();
      const response: any = await apolloServer.executeOperation(
        {
          query: surveyResultQuery,
          variables: {
            surveyId,
          },
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
      expect(
        response.body.singleResult.data?.surveyResult.surveyId
      ).toBeTruthy();
      expect(response.body.singleResult.data?.surveyResult.question).toBe(
        'Question'
      );
      expect(response.body.singleResult.data?.surveyResult.date).toBe(
        now.toISOString()
      );
      expect(response.body.singleResult.data?.surveyResult.answers).toEqual([
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
  });
});
