import { MongoHelper } from '@/infra/db';
import { Collection } from 'mongodb';
import { hash } from 'bcrypt';
import { ApolloServer } from '@apollo/server';
import { makeApolloServer } from './helpers';

let accountCollection: Collection;
let apolloServer: ApolloServer;

describe('Login GraphQL', () => {
  beforeAll(async () => {
    apolloServer = makeApolloServer();
    await MongoHelper.connect(process.env.MONGO_URL || '');
  });

  afterAll(async () => {
    await MongoHelper.disconnect();
  });

  beforeEach(async () => {
    accountCollection = await MongoHelper.getCollection('accounts');
    await accountCollection.deleteMany({});
  });

  describe('Login Query', () => {
    const loginQuery = `#graphql
      query login ($email: String!, $password: String!) {
        login (email: $email, password: $password) {
          accessToken
          name
        }
      }
    `;

    test('Should return an Account on valid credentials', async () => {
      const password = await hash('123', 12);
      await accountCollection.insertOne({
        name: 'Daniel',
        email: 'daniel@gmail.com',
        password,
      });
      const response: any = await apolloServer.executeOperation({
        query: loginQuery,
        variables: { email: 'daniel@gmail.com', password: '123' },
      });
      expect(response.body.singleResult.data?.login.accessToken).toBeTruthy();
      expect(response.body.singleResult.data?.login.name).toBe('Daniel');
    });

    test('Should return UnauthorizedError on invalid credentials', async () => {
      const response: any = await apolloServer.executeOperation({
        query: loginQuery,
        variables: { email: 'daniel@gmail.com', password: '123' },
      });
      expect(response.body.singleResult.data).toBeFalsy();
      expect(response.body.singleResult.errors[0].message).toBe('Unauthorized');
    });
  });

  describe('SignUp Mutation', () => {
    const signUpMutation = `#graphql
      mutation signUp ($name: String!, $email: String!, $password: String!, $passwordConfirmation: String!) {
        signUp (name: $name, email: $email, password: $password, passwordConfirmation: $passwordConfirmation) {
          accessToken
          name
        }
      }
    `;

    test('Should return an Account on valid data', async () => {
      const response: any = await apolloServer.executeOperation({
        query: signUpMutation,
        variables: {
          name: 'Daniel',
          email: 'daniel@gmail.com',
          password: '123',
          passwordConfirmation: '123',
        },
      });
      expect(response.body.singleResult.data?.signUp.accessToken).toBeTruthy();
      expect(response.body.singleResult.data?.signUp.name).toBe('Daniel');
    });
  });
});
