import {
  AccountModel,
  AddAccountModel,
  AddAccountRepository,
  LoadAccountByEmailRepository,
  LoadAccountByTokenRepository,
  MongoHelper,
  UpdateAccessTokenRepository,
} from "./account-mongo-repository-protocols";

export class AccountMongoRepository
  implements
    AddAccountRepository,
    LoadAccountByEmailRepository,
    UpdateAccessTokenRepository,
    LoadAccountByTokenRepository
{
  async add(accountData: AddAccountModel): Promise<AccountModel> {
    const accountCollection = await MongoHelper.getCollection("accounts");
    const result = await accountCollection.insertOne(accountData);
    const account = await accountCollection.findOne({
      _id: result.insertedId,
    });
    return MongoHelper.map(account);
  }

  async loadByEmail(email: string): Promise<AccountModel> {
    const accountCollection = await MongoHelper.getCollection("accounts");
    const account = await accountCollection.findOne({ email: email });
    return account && MongoHelper.map(account);
  }

  async updateAccessToken(id: string, token: string): Promise<void> {
    const accountCollection = await MongoHelper.getCollection("accounts");
    const accountId = MongoHelper.toObjectId(id);
    await accountCollection.updateOne(
      { _id: accountId },
      { $set: { accessToken: token } }
    );
  }

  async loadByToken(token: string, role?: string): Promise<AccountModel> {
    const accountCollection = await MongoHelper.getCollection("accounts");
    const account = await accountCollection.findOne({
      accessToken: token,
      role,
    });
    return account && MongoHelper.map(account);
  }
}
