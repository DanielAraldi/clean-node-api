import { MongoHelper } from '@/infra/db';
import { Collection } from 'mongodb';
import { hash } from 'bcrypt';
import { sign } from 'jsonwebtoken';
import request from 'supertest';
import app from '@/main/config/app';
import env from '@/main/config/env';

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

let accountCollection: Collection;

describe('Login GraphQL', () => {
  beforeAll(async () => {
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
    const query = `query {
      login (email: "daniel@gmail.com", password: "123") {
        accessToken
        name
      }
    }`;

    test('Should return an Account on valid credentials', async () => {
      const password = await hash('123', 12);
      await accountCollection.insertOne({
        name: 'Daniel',
        email: 'daniel@gmail.com',
        password,
      });
      const response = await request(app).post('/api/graphql').send({ query });
      expect(response.status).toBe(200);
      expect(response.body.data.login.accessToken).toBeTruthy();
      expect(response.body.data.login.name).toBe('Daniel');
    });

    test('Should return UnauthorizedError on invalid credentials', async () => {
      const response = await request(app).post('/api/graphql').send({ query });
      expect(response.status).toBe(401);
      expect(response.body.data).toBeFalsy();
      expect(response.body.errors[0].message).toBe('Unauthorized');
    });
  });

  describe('SignUp Mutation', () => {
    const query = `mutation {
      signUp (name: "Daniel", email: "daniel@gmail.com", password: "123", passwordConfirmation: "123") {
        accessToken
        name
      }
    }`;

    test('Should return an Account on valid data', async () => {
      const response = await request(app).post('/api/graphql').send({ query });
      expect(response.status).toBe(200);
      expect(response.body.data.signUp.accessToken).toBeTruthy();
      expect(response.body.data.signUp.name).toBe('Daniel');
    });

    test('Should return EmailInUseError on email in use', async () => {
      const password = await hash('123', 12);
      await accountCollection.insertOne({
        name: 'Daniel',
        email: 'daniel@gmail.com',
        password,
      });
      const response = await request(app).post('/api/graphql').send({ query });
      expect(response.status).toBe(403);
      expect(response.body.data).toBeFalsy();
      expect(response.body.errors[0].message).toBe(
        'The received email is already in use'
      );
    });
  });

  describe('RefreshToken Mutation', () => {
    test('Should return a RefreshToken on valid data', async () => {
      const accessToken = await makeAccessToken();
      const response = await request(app)
        .post('/api/graphql')
        .send({
          query: `mutation {
            refresh (accessToken: "${accessToken}") {
              accessToken
            }
          }`,
        });
      expect(response.status).toBe(200);
      expect(response.body.data.refresh.accessToken).toBeTruthy();
    });
  });
});
