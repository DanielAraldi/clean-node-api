import {
  AddAccountRepository,
  CheckAccountByEmailRepository,
  EditAccountRepository,
  LoadAccountByEmailRepository,
  LoadAccountByTokenRepository,
  UpdateAccessTokenRepository,
} from '@/data/protocols/db';
import { faker } from '@faker-js/faker';

export class AddAccountRepositorySpy implements AddAccountRepository {
  result = true;
  addAccountParams: AddAccountRepository.Params;

  async add(
    data: AddAccountRepository.Params
  ): Promise<AddAccountRepository.Result> {
    this.addAccountParams = data;
    return Promise.resolve(this.result);
  }
}

export class CheckAccountByEmailRepositorySpy
  implements CheckAccountByEmailRepository
{
  result = false;
  email: string;

  async checkByEmail(
    email: string
  ): Promise<CheckAccountByEmailRepository.Result> {
    this.email = email;
    return Promise.resolve(this.result);
  }
}

export class LoadAccountByEmailRepositorySpy
  implements LoadAccountByEmailRepository
{
  result = {
    id: faker.datatype.uuid(),
    name: faker.name.fullName(),
    password: faker.internet.password(),
  };

  email: string;

  async loadByEmail(
    email: string
  ): Promise<LoadAccountByEmailRepository.Result> {
    this.email = email;
    return Promise.resolve(this.result);
  }
}

export class LoadAccountByTokenRepositorySpy
  implements LoadAccountByTokenRepository
{
  result = { id: faker.datatype.uuid() };
  token: string;
  role: string;

  async loadByToken(
    token: string,
    role?: string
  ): Promise<LoadAccountByTokenRepository.Result> {
    this.token = token;
    this.role = role;
    return Promise.resolve(this.result);
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

export class EditAccountRepositorySpy implements EditAccountRepository {
  editAccountParams: EditAccountRepository.Params;

  async edit(data: EditAccountRepository.Params): Promise<void> {
    this.editAccountParams = data;
    return Promise.resolve();
  }
}
