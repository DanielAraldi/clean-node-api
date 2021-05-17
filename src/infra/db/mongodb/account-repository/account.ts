import {
  AccountModel,
  AddAccountModel,
  AddAccountRepository,
  MongoHelper,
} from "./account-protocols";

export class AccountMongoRepository implements AddAccountRepository {
  async add(accountData: AddAccountModel): Promise<AccountModel> {
    const accountCollection = await MongoHelper.getCollection("accounts");
    const result = await accountCollection.insertOne(accountData);
    // result.ops[0] is return first result operator
    return MongoHelper.map(result.ops[0]);
  }
}
