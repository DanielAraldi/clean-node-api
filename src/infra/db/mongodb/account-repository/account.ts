import { LoadAccountByEmailRepository } from "../../../../data/protocols/db/load-account-by-email-repository";
import {
  AccountModel,
  AddAccountModel,
  AddAccountRepository,
  MongoHelper,
} from "./account-protocols";

export class AccountMongoRepository
  implements AddAccountRepository, LoadAccountByEmailRepository
{
  async add(accountData: AddAccountModel): Promise<AccountModel> {
    const accountCollection = await MongoHelper.getCollection("accounts");
    const result = await accountCollection.insertOne(accountData);
    // result.ops[0] is return first result operator
    return MongoHelper.map(result.ops[0]);
  }

  async loadByEmail(email: string): Promise<AccountModel> {
    const accountCollection = await MongoHelper.getCollection("accounts");
    const account = await accountCollection.findOne({ email: email });
    return MongoHelper.map(account);
  }
}
