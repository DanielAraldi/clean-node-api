import {
  AddAccount,
  Authentication,
  EditAccount,
  LoadAccount,
} from '@/domain/usecases';
import { faker } from '@faker-js/faker';

export const mockAddAccountParams = (): AddAccount.Params => ({
  name: faker.name.fullName(),
  email: faker.internet.email(),
  password: faker.internet.password(),
});

export const mockAuthenticationParams = (): Authentication.Params => ({
  email: faker.internet.email(),
  password: faker.internet.password(),
});

export const mockEditAccountParams = (): EditAccount.Params => ({
  name: faker.name.fullName(),
  email: faker.internet.email(),
  accountId: faker.datatype.uuid(),
});

export const mockLoadAccountModel = (): LoadAccount.Result => ({
  id: faker.datatype.uuid(),
  name: faker.name.fullName(),
  email: faker.internet.email(),
  role: faker.random.word(),
});
