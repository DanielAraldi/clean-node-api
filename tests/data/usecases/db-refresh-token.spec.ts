import { DbRefreshToken } from '@/data/usecases';
import { mockRefreshTokenParams, throwError } from '@/tests/domain/mocks';
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

  test('Should throw if LoadAccountByTokenRepository throws', async () => {
    const { sut, loadAccountByTokenRepositorySpy } = makeSut();
    const refreshTokenParams = mockRefreshTokenParams();
    jest
      .spyOn(loadAccountByTokenRepositorySpy, 'loadByToken')
      .mockImplementationOnce(throwError);
    const promise = sut.refresh(refreshTokenParams.accessToken);
    await expect(promise).rejects.toThrow();
  });

  test('Should return null if LoadAccountByTokenRepository returns null', async () => {
    const { sut, loadAccountByTokenRepositorySpy } = makeSut();
    loadAccountByTokenRepositorySpy.result = null;
    const refreshTokenParams = mockRefreshTokenParams();
    const account = await sut.refresh(refreshTokenParams.accessToken);
    expect(account).toBeNull();
  });
});
