import { AddAccount, Authentication, EditAccount } from '@/domain/usecases';
import { RefreshTokenController } from '@/presentation/controllers';
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

export const mockRefreshTokenParams = (): RefreshTokenController.Request => ({
  accessToken: faker.datatype.uuid(),
});

export const mockEditAccountParams = (): EditAccount.Params => ({
  name: faker.name.fullName(),
  email: faker.internet.email(),
  accountId: faker.datatype.uuid(),
});
