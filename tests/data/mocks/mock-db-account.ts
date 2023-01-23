import {
  AddAccountRepository,
  LoadAccountByEmailRepository,
  LoadAccountByTokenRepository,
  UpdateAccessTokenRepository,
} from '@/data/protocols/db';
import { mockAccountModel } from '@/../tests/domain/mocks';
import { AccountModel } from '@/domain/models/account';

export class AddAccountRepositorySpy implements AddAccountRepository {
  accountModel = mockAccountModel();
  addAccountParams: AddAccountRepository.Params;

  async add(
    data: AddAccountRepository.Params
  ): Promise<AddAccountRepository.Result> {
    this.addAccountParams = data;
    return Promise.resolve(this.accountModel);
  }
}

export class LoadAccountByEmailRepositorySpy
  implements LoadAccountByEmailRepository
{
  accountModel = mockAccountModel();
  email: string;

  async loadByEmail(email: string): Promise<AccountModel> {
    this.email = email;
    return Promise.resolve(this.accountModel);
  }
}

export class LoadAccountByTokenRepositorySpy
  implements LoadAccountByTokenRepository
{
  accountModel = mockAccountModel();
  token: string;
  role: string;

  async loadByToken(
    token: string,
    role?: string
  ): Promise<LoadAccountByTokenRepository.Result> {
    this.token = token;
    this.role = role;
    return Promise.resolve(this.accountModel);
  }
}

export class UpdateAccessTokenRepositorySpy
  implements UpdateAccessTokenRepository
{
  id: string;
  token: string;

  async updateAccessToken(id: string, token: string): Promise<void> {
    this.id = id;
    this.token = token;
    return Promise.resolve();
  }
}
