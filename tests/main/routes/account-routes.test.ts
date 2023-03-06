import { MongoHelper } from '@/infra/db';
import app from '@/main/config/app';
import { Collection } from 'mongodb';
import request from 'supertest';
import { hash } from 'bcrypt';
import { faker } from '@faker-js/faker';
import { sign } from 'jsonwebtoken';
import env from '@/main/config/env';

let accountCollection: Collection;

type SutAccountTypes = {
  id: string;
  name: string;
  email: string;
  accessToken: string;
  role?: 'admin';
};

const makeAccount = async (): Promise<SutAccountTypes> => {
  const password = hash(faker.internet.password(), 12);
  const { insertedId } = await accountCollection.insertOne({
    name: faker.name.fullName(),
    email: faker.internet.email(),
    role: 'admin',
    password,
  });
  const accessToken = sign({ id: insertedId }, env.jwtSecret);
  await accountCollection.updateOne(
    { _id: insertedId },
    { $set: { accessToken } }
  );
  const account = await accountCollection.findOne({ _id: insertedId });
  return MongoHelper.assign<SutAccountTypes>(account);
};

describe('Account Routes', () => {
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

  describe('PUT /account/edit', () => {
    test('Should return 204 on success', async () => {
      const account = await makeAccount();
      const newName = faker.name.fullName();
      const newEmail = faker.internet.email();
      await request(app)
        .put('/api/account/edit')
        .send({
          name: newName,
          email: newEmail,
        })
        .set('x-access-token', account.accessToken)
        .expect(204);
      const accountUpdated = await accountCollection.findOne({
        _id: account.id,
      });
      expect(accountUpdated).toBeTruthy();
      expect(accountUpdated.name).toBe(newName);
      expect(accountUpdated.email).toBe(newEmail);
    });
  });
});
