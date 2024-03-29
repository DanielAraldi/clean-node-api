import { AccountMongoRepository, MongoHelper } from '@/infra/db';
import {
  mockAddAccountParams,
  mockEditAccountParams,
} from '@/tests/domain/mocks';
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
      const isValid = await sut.add(addAccountParams);
      const account = await accountCollection.findOne({
        email: addAccountParams.email,
      });
      expect(isValid).toBe(true);
      expect(account.createdAt).toBeTruthy();
    });
  });

  describe('edit()', () => {
    test('Should update the email and name on success', async () => {
      const sut = makeSut();
      const collection = await accountCollection.insertOne(
        mockAddAccountParams()
      );
      const editAccountParams = mockEditAccountParams();
      const accountId = collection.insertedId;
      await sut.edit({ ...editAccountParams, accountId: accountId.toString() });
      const account = await accountCollection.findOne({
        _id: accountId,
      });
      expect(account).toBeTruthy();
      expect(account.name).toBe(editAccountParams.name);
      expect(account.email).toBe(editAccountParams.email);
      expect(account.updatedAt).toBeTruthy();
    });

    test('Should update the email if only is provided', async () => {
      const sut = makeSut();
      const addAccountParams = mockAddAccountParams();
      const collection = await accountCollection.insertOne(addAccountParams);
      const email = faker.internet.email();
      const accountId = collection.insertedId;
      await sut.edit({
        email,
        accountId: accountId.toString(),
      });
      const account = await accountCollection.findOne({
        _id: accountId,
      });
      expect(account).toBeTruthy();
      expect(account.name).toBe(addAccountParams.name);
      expect(account.email).toBe(email);
      expect(account.updatedAt).toBeTruthy();
    });

    test('Should update the name if only is provided', async () => {
      const sut = makeSut();
      const addAccountParams = mockAddAccountParams();
      const collection = await accountCollection.insertOne(addAccountParams);
      const name = faker.name.fullName();
      const accountId = collection.insertedId;
      await sut.edit({
        name,
        accountId: accountId.toString(),
      });
      const account = await accountCollection.findOne({
        _id: accountId,
      });
      expect(account).toBeTruthy();
      expect(account.email).toBe(addAccountParams.email);
      expect(account.name).toBe(name);
      expect(account.updatedAt).toBeTruthy();
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
      expect(account.password).toBe(addAccountParams.password);
    });

    test('Should return null if loadByEmail fails', async () => {
      const sut = makeSut();
      const account = await sut.loadByEmail(faker.internet.email());
      expect(account).toBeFalsy();
    });
  });

  describe('checkByEmail()', () => {
    test('Should return true if email is valid', async () => {
      const sut = makeSut();
      const addAccountParams = mockAddAccountParams();
      await accountCollection.insertOne(addAccountParams);
      const exists = await sut.checkByEmail(addAccountParams.email);
      expect(exists).toBe(true);
    });

    test('Should return false if email is not valid', async () => {
      const sut = makeSut();
      const exists = await sut.checkByEmail(faker.internet.email());
      expect(exists).toBe(false);
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
