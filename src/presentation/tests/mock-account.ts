import {
  AddAccount,
  AddAccountParams,
} from '@/domain/usecases/account/add-account';
import {
  Authentication,
  AuthenticationParams,
} from '@/domain/usecases/account/authentication';
import { AuthenticationModel } from '@/domain/models/authentication';
import { LoadAccountByToken } from '@/domain/usecases/account/load-account-by-token';
import { AccountModel } from '@/domain/models/account';
import { mockAccountModel } from '@/domain/tests';
import { faker } from '@faker-js/faker';

export class AddAccountSpy implements AddAccount {
  accountModel = mockAccountModel();
  addAccountParams: AddAccountParams;

  async add(account: AddAccountParams): Promise<AccountModel> {
    this.addAccountParams = account;
    return Promise.resolve(this.accountModel);
  }
}

export class AuthenticationSpy implements Authentication {
  authenticationParams: AuthenticationParams;
  authenticationModel = {
    accessToken: faker.datatype.uuid(),
    name: faker.name.fullName(),
  };

  async auth(
    authenticationParams: AuthenticationParams
  ): Promise<AuthenticationModel | null> {
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
