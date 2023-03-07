import { MongoHelper } from '@/infra/db';
import {
  AddAccountRepository,
  LoadAccountByEmailRepository,
  UpdateAccessTokenRepository,
  LoadAccountByTokenRepository,
  CheckAccountByEmailRepository,
  EditAccountRepository,
} from '@/data/protocols/db';

export class AccountMongoRepository
  implements
    AddAccountRepository,
    EditAccountRepository,
    LoadAccountByEmailRepository,
    UpdateAccessTokenRepository,
    LoadAccountByTokenRepository,
    CheckAccountByEmailRepository
{
  async add(
    data: AddAccountRepository.Params
  ): Promise<AddAccountRepository.Result> {
    const accountCollection = await MongoHelper.getCollection('accounts');
    const result = await accountCollection.insertOne(data);
    return !!result.insertedId;
  }

  async edit(data: EditAccountRepository.Params): Promise<void> {
    const accountCollection = await MongoHelper.getCollection('accounts');
    const accountId = MongoHelper.objectId(data.accountId);
    const email = data?.email ? { email: data.email } : {};
    const name = data?.name ? { name: data.name } : {};
    await accountCollection.updateOne(
      { _id: accountId },
      { $set: { ...email, ...name, updatedAt: data.updatedAt } }
    );
  }

  async loadByEmail(
    email: string
  ): Promise<LoadAccountByEmailRepository.Result> {
    const accountCollection = await MongoHelper.getCollection('accounts');
    const account = await accountCollection.findOne(
      { email },
      { projection: { _id: 1, name: 1, password: 1 } }
    );
    if (account) {
      return MongoHelper.assign<LoadAccountByEmailRepository.Result>(account);
    }
    return null;
  }

  async checkByEmail(
    email: string
  ): Promise<CheckAccountByEmailRepository.Result> {
    const accountCollection = await MongoHelper.getCollection('accounts');
    const account = await accountCollection.findOne(
      { email },
      { projection: { _id: 1 } }
    );
    return !!account;
  }

  async updateAccessToken(id: string, token: string): Promise<void> {
    const accountCollection = await MongoHelper.getCollection('accounts');
    const accountId = MongoHelper.objectId(id);
    await accountCollection.updateOne(
      { _id: accountId },
      { $set: { accessToken: token } }
    );
  }

  async loadByToken(
    token: string,
    role?: string
  ): Promise<LoadAccountByTokenRepository.Result> {
    const accountCollection = await MongoHelper.getCollection('accounts');
    const account = await accountCollection.findOne(
      {
        accessToken: token,
        $or: [{ role }, { role: 'admin' }],
      },
      { projection: { _id: 1 } }
    );
    if (account) {
      return MongoHelper.assign<LoadAccountByTokenRepository.Result>(account);
    }
    return null;
  }
}
