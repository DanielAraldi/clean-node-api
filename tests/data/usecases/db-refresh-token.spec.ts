import { DbRefreshToken } from '@/data/usecases';
import { mockRefreshTokenParams } from '@/tests/domain/mocks';
import { LoadAccountByTokenRepositorySpy } from '@/tests/data/mocks';
import { faker } from '@faker-js/faker';

type SutTypes = {
  loadAccountByTokenRepositorySpy: LoadAccountByTokenRepositorySpy;
  sut: DbRefreshToken;
};

const makeSut = (): SutTypes => {
  const loadAccountByTokenRepositorySpy = new LoadAccountByTokenRepositorySpy();
  const sut = new DbRefreshToken(loadAccountByTokenRepositorySpy);
  return { sut, loadAccountByTokenRepositorySpy };
};

let accessToken: string;

describe('DbRefreshToken UseCase', () => {
  beforeEach(() => {
    accessToken = faker.datatype.uuid();
  });

  test('Should call LoadAccountByTokenRepository with correct access token', async () => {
    const { sut, loadAccountByTokenRepositorySpy } = makeSut();
    const refreshTokenParams = mockRefreshTokenParams();
    await sut.refresh(refreshTokenParams.accessToken);
    expect(loadAccountByTokenRepositorySpy.token).toBe(
      refreshTokenParams.accessToken
    );
  });
});
