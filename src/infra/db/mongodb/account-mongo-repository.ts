import { MongoHelper } from '@/infra/db';
import {
  AddAccountRepository,
  LoadAccountByEmailRepository,
  UpdateAccessTokenRepository,
  LoadAccountByTokenRepository,
} from '@/data/protocols/db';
import { AccountModel } from '@/domain/models';

export class AccountMongoRepository
  implements
    AddAccountRepository,
    LoadAccountByEmailRepository,
    UpdateAccessTokenRepository,
    LoadAccountByTokenRepository
{
  async add(
    data: AddAccountRepository.Params
  ): Promise<AddAccountRepository.Result> {
    const accountCollection = await MongoHelper.getCollection('accounts');
    const result = await accountCollection.insertOne(data);
    const account = await accountCollection.findOne({
      _id: result.insertedId,
    });
    return MongoHelper.assign<AddAccountRepository.Result>(account);
  }

  async loadByEmail(email: string): Promise<AccountModel | null> {
    const accountCollection = await MongoHelper.getCollection('accounts');
    const account = await accountCollection.findOne({ email });
    return account && MongoHelper.assign<AccountModel>(account);
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
    return (
      account &&
      MongoHelper.assign<LoadAccountByTokenRepository.Result>(account)
    );
  }
}
