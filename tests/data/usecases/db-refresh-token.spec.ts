import { DbRefreshToken } from '@/data/usecases';
import { mockRefreshTokenParams, throwError } from '@/tests/domain/mocks';
import {
  EncrypterSpy,
  LoadAccountByTokenRepositorySpy,
  UpdateAccessTokenRepositorySpy,
} from '@/tests/data/mocks';
import { faker } from '@faker-js/faker';

type SutTypes = {
  updateAccessTokenRepositorySpy: UpdateAccessTokenRepositorySpy;
  encrypterSpy: EncrypterSpy;
  loadAccountByTokenRepositorySpy: LoadAccountByTokenRepositorySpy;
  sut: DbRefreshToken;
};

const makeSut = (): SutTypes => {
  const updateAccessTokenRepositorySpy = new UpdateAccessTokenRepositorySpy();
  const encrypterSpy = new EncrypterSpy();
  const loadAccountByTokenRepositorySpy = new LoadAccountByTokenRepositorySpy();
  const sut = new DbRefreshToken(
    loadAccountByTokenRepositorySpy,
    encrypterSpy,
    updateAccessTokenRepositorySpy
  );
  return {
    sut,
    loadAccountByTokenRepositorySpy,
    encrypterSpy,
    updateAccessTokenRepositorySpy,
  };
};

let accessToken: string;

describe('DbRefreshToken UseCase', () => {
  beforeEach(() => {
    accessToken = faker.datatype.uuid();
  });

  test('Should call LoadAccountByTokenRepository with correct access token', async () => {
    const { sut, loadAccountByTokenRepositorySpy } = makeSut();
    await sut.refresh(accessToken);
    expect(loadAccountByTokenRepositorySpy.token).toBe(accessToken);
  });

  test('Should throw if LoadAccountByTokenRepository throws', async () => {
    const { sut, loadAccountByTokenRepositorySpy } = makeSut();
    jest
      .spyOn(loadAccountByTokenRepositorySpy, 'loadByToken')
      .mockImplementationOnce(throwError);
    const promise = sut.refresh(accessToken);
    await expect(promise).rejects.toThrow();
  });

  test('Should return null if LoadAccountByTokenRepository returns null', async () => {
    const { sut, loadAccountByTokenRepositorySpy } = makeSut();
    loadAccountByTokenRepositorySpy.result = null;
    const account = await sut.refresh(accessToken);
    expect(account).toBeNull();
  });

  test('Should call Encrypter with correct plaintext', async () => {
    const { sut, encrypterSpy, loadAccountByTokenRepositorySpy } = makeSut();
    await sut.refresh(accessToken);
    expect(encrypterSpy.plaintext).toBe(
      loadAccountByTokenRepositorySpy.result.id
    );
  });

  test('Should throw if Encrypter throws', async () => {
    const { sut, encrypterSpy } = makeSut();
    jest.spyOn(encrypterSpy, 'encrypt').mockImplementationOnce(throwError);
    const promise = sut.refresh(accessToken);
    await expect(promise).rejects.toThrow();
  });

  test('Should call UpdateAccessTokenRepository with correct values', async () => {
    const {
      sut,
      updateAccessTokenRepositorySpy,
      loadAccountByTokenRepositorySpy,
      encrypterSpy,
    } = makeSut();
    await sut.refresh(accessToken);
    expect(updateAccessTokenRepositorySpy.id).toBe(
      loadAccountByTokenRepositorySpy.result.id
    );
    expect(updateAccessTokenRepositorySpy.token).toBe(encrypterSpy.ciphertext);
  });

  test('Should throw if UpdateAccessTokenRepository throws', async () => {
    const { sut, updateAccessTokenRepositorySpy } = makeSut();
    jest
      .spyOn(updateAccessTokenRepositorySpy, 'updateAccessToken')
      .mockImplementationOnce(throwError);
    const promise = sut.refresh(accessToken);
    await expect(promise).rejects.toThrow();
  });
});
