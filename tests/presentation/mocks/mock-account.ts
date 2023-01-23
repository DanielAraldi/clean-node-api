import {
  Authentication,
  LoadAccountByToken,
  AddAccount,
} from '@/domain/usecases';
import { faker } from '@faker-js/faker';

export class AddAccountSpy implements AddAccount {
  result = true;
  addAccountParams: AddAccount.Params;

  async add(account: AddAccount.Params): Promise<AddAccount.Result> {
    this.addAccountParams = account;
    return Promise.resolve(this.result);
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
  result = { id: faker.datatype.uuid() };
  accessToken: string;
  role: string;

  async load(
    accessToken: string,
    role?: string
  ): Promise<LoadAccountByToken.Result> {
    this.accessToken = accessToken;
    this.role = role;
    return Promise.resolve(this.result);
  }
}
