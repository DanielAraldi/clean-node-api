import { MongoHelper } from '@/infra/db';
import app from '@/main/config/app';
import { Collection } from 'mongodb';
import { hash } from 'bcrypt';
import request from 'supertest';

let accountCollection: Collection;

describe('Login Routes', () => {
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

  describe('POST /signup', () => {
    test('Should return 200 on signup', async () =>
      await request(app)
        .post('/api/signup')
        .send({
          name: 'Daniel',
          email: 'daniel@gmail.com',
          password: '123',
          passwordConfirmation: '123',
        })
        .expect(200));

    test('Should return 403 on signup', async () => {
      const password = await hash('123', 12);
      await accountCollection.insertOne({
        name: 'Daniel',
        email: 'daniel@gmail.com',
        password,
      });
      await request(app)
        .post('/api/signup')
        .send({
          name: 'Daniel',
          email: 'daniel@gmail.com',
          password: '123',
          passwordConfirmation: '123',
        })
        .expect(403);
    });
  });

  describe('POST /login', () => {
    test('Should return 200 on login', async () => {
      const password = await hash('123', 12);
      await accountCollection.insertOne({
        name: 'Daniel',
        email: 'daniel@gmail.com',
        password,
      });
      await request(app)
        .post('/api/login')
        .send({
          email: 'daniel@gmail.com',
          password: '123',
        })
        .expect(200);
    });

    test('Should return 401 on login', async () =>
      await request(app)
        .post('/api/login')
        .send({
          email: 'daniel@gmail.com',
          password: '123',
        })
        .expect(401));
  });

  describe('POST /refresh', () => {
    test('Should return 200 on refresh', async () => {
      const password = await hash('123', 12);
      await accountCollection.insertOne({
        name: 'Daniel',
        email: 'daniel@gmail.com',
        password,
      });
      await request(app)
        .post('/api/login')
        .send({
          email: 'daniel@gmail.com',
          password: '123',
        })
        .expect(200);
      const account = await accountCollection.findOne({
        email: 'daniel@gmail.com',
      });
      await request(app)
        .post('/api/refresh')
        .send({
          accessToken: account?.accessToken,
        })
        .expect(200);
    });

    test('Should return 401 on refresh', async () => {
      const password = await hash('123', 12);
      await accountCollection.insertOne({
        name: 'Daniel',
        email: 'daniel@gmail.com',
        password,
      });
      await request(app)
        .post('/api/login')
        .send({
          email: 'daniel@gmail.com',
          password: '123',
        })
        .expect(200);
      await request(app)
        .post('/api/refresh')
        .send({
          accessToken: 'invalid_token',
        })
        .expect(401);
    });
  });
});
