import { AddAccount, Authentication, RefreshToken } from '@/domain/usecases';
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

export const mockRefreshTokenParams = (): RefreshToken.Params => ({
  accessToken: faker.datatype.uuid(),
});
