import { AccountMongoRepository, MongoHelper } from '@/infra/db';
import { mockAddAccountParams } from '@/../tests/domain/mocks';
import { Collection } from 'mongodb';
import { faker } from '@faker-js/faker';

let accountCollection: Collection;

const makeSut = (): AccountMongoRepository => new AccountMongoRepository();

describe('AccountMongoRepository', () => {
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

  describe('add()', () => {
    test('Should return an account on add success', async () => {
      const sut = makeSut();
      const addAccountParams = mockAddAccountParams();
      const account = await sut.add(addAccountParams);
      expect(account).toBeTruthy();
      expect(account.id).toBeTruthy();
      expect(account.name).toBe(addAccountParams.name);
      expect(account.email).toBe(addAccountParams.email);
      expect(account.password).toBe(addAccountParams.password);
    });
  });

  describe('loadByEmail()', () => {
    test('Should return an account on success', async () => {
      const sut = makeSut();
      const addAccountParams = mockAddAccountParams();
      await accountCollection.insertOne(addAccountParams);
      const account = await sut.loadByEmail(addAccountParams.email);
      expect(account).toBeTruthy();
      expect(account.id).toBeTruthy();
      expect(account.name).toBe(addAccountParams.name);
      expect(account.email).toBe(addAccountParams.email);
      expect(account.password).toBe(addAccountParams.password);
    });

    test('Should return null if loadByEmail fails', async () => {
      const sut = makeSut();
      const account = await sut.loadByEmail(faker.internet.email());
      expect(account).toBeFalsy();
    });
  });

  describe('updateAccessToken()', () => {
    test('Should update the account accessToken on success', async () => {
      const sut = makeSut();
      const collection = await accountCollection.insertOne(
        mockAddAccountParams()
      );
      const fakeAccount = await accountCollection.findOne({
        _id: collection.insertedId,
      });
      expect(fakeAccount?.accessToken).toBeFalsy();
      const accessToken = faker.datatype.uuid();
      await sut.updateAccessToken(fakeAccount._id.toString(), accessToken);
      const account = await accountCollection.findOne({ _id: fakeAccount._id });
      expect(account).toBeTruthy();
      expect(account.accessToken).toBe(accessToken);
    });
  });

  describe('loadByToken()', () => {
    let name = faker.name.fullName();
    let email = faker.internet.email();
    let password = faker.internet.password();
    let accessToken = faker.datatype.uuid();

    beforeEach(() => {
      name = faker.name.fullName();
      email = faker.internet.email();
      password = faker.internet.password();
      accessToken = faker.datatype.uuid();
    });

    test('Should return an account on loadByToken without role', async () => {
      const sut = makeSut();
      await accountCollection.insertOne({
        name,
        email,
        password,
        accessToken,
      });
      const account = await sut.loadByToken(accessToken);
      expect(account).toBeTruthy();
      expect(account.id).toBeTruthy();
    });

    test('Should return an account on loadByToken with admin role', async () => {
      const sut = makeSut();
      await accountCollection.insertOne({
        name,
        email,
        password,
        accessToken,
        role: 'admin',
      });
      const account = await sut.loadByToken(accessToken, 'admin');
      expect(account).toBeTruthy();
      expect(account.id).toBeTruthy();
    });

    test('Should return null on loadByToken with invalid role', async () => {
      const sut = makeSut();
      await accountCollection.insertOne({
        name,
        email,
        password,
        accessToken,
      });
      const account = await sut.loadByToken(accessToken, 'admin');
      expect(account).toBeFalsy();
    });

    test('Should return an account on loadByToken if user is admin', async () => {
      const sut = makeSut();
      await accountCollection.insertOne({
        name,
        email,
        password,
        accessToken,
        role: 'admin',
      });
      const account = await sut.loadByToken(accessToken);
      expect(account).toBeTruthy();
      expect(account.id).toBeTruthy();
    });

    test('Should return null if loadByToken fails', async () => {
      const sut = makeSut();
      const account = await sut.loadByToken(accessToken);
      expect(account).toBeFalsy();
    });
  });
});
