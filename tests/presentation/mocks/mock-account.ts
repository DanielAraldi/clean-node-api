import {
  Authentication,
  LoadAccountByToken,
  AddAccount,
} from '@/domain/usecases';
import { AccountModel } from '@/domain/models';
import { mockAccountModel } from '@/../tests/domain/mocks';
import { faker } from '@faker-js/faker';

export class AddAccountSpy implements AddAccount {
  isValid = true;
  addAccountParams: AddAccount.Params;

  async add(account: AddAccount.Params): Promise<AddAccount.Result> {
    this.addAccountParams = account;
    return Promise.resolve(this.isValid);
  }
}

export class AuthenticationSpy implements Authentication {
  authenticationParams: Authentication.Params;
  authenticationModel = {
    accessToken: faker.datatype.uuid(),
    name: faker.name.fullName(),
  };

  async auth(
    authenticationParams: Authentication.Params
  ): Promise<Authentication.Result> {
    this.authenticationParams = authenticationParams;
    return Promise.resolve(this.authenticationModel);
  }
}

export class LoadAccountByTokenSpy implements LoadAccountByToken {
  accountModel = mockAccountModel();
  accessToken: string;
  role: string;

  async load(accessToken: string, role?: string): Promise<AccountModel> {
    this.accessToken = accessToken;
    this.role = role;
    return Promise.resolve(this.accountModel);
  }
}
