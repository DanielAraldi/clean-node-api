import { DbLoadAccountByToken } from "./db-load-account-by-token";
import {
  AccountModel,
  Decrypter,
  LoadAccountByTokenRepository,
} from "./db-load-account-by-token-protocols";
import { throwError, mockAccountModel } from "@/domain/tests";
import { mockDecrypter } from "@/data/tests";

const makeLoadAccountByTokenRepository = (): LoadAccountByTokenRepository => {
  class LoadAccountByTokenRepositoryStub
    implements LoadAccountByTokenRepository
  {
    async loadByToken(
      token: string,
      role?: string
    ): Promise<AccountModel | null> {
      return new Promise((resolve) => resolve(mockAccountModel()));
    }
  }
  return new LoadAccountByTokenRepositoryStub();
};

type SutTypes = {
  sut: DbLoadAccountByToken;
  decrypterStub: Decrypter;
  loadAccountByTokenRepositoryStub: LoadAccountByTokenRepository;
};

const makeSut = (): SutTypes => {
  const loadAccountByTokenRepositoryStub = makeLoadAccountByTokenRepository();
  const decrypterStub = mockDecrypter();
  const sut = new DbLoadAccountByToken(
    decrypterStub,
    loadAccountByTokenRepositoryStub
  );
  return { sut, decrypterStub, loadAccountByTokenRepositoryStub };
};

describe("DbLoadAccountByToken Usecase", () => {
  test("Should call Decrypter with correct values", async () => {
    const { decrypterStub, sut } = makeSut();
    const decyypterSpy = jest.spyOn(decrypterStub, "decrypt");
    await sut.load("any_token", "any_role");
    expect(decyypterSpy).toHaveBeenCalledWith("any_token");
  });

  test("Should return null if Decrypter returns null", async () => {
    const { decrypterStub, sut } = makeSut();
    jest.spyOn(decrypterStub, "decrypt").mockReturnValueOnce(null);
    const account = await sut.load("any_token", "any_role");
    expect(account).toBeNull();
  });

  test("Should call LoadAccountByTokenRepository with correct values", async () => {
    const { loadAccountByTokenRepositoryStub, sut } = makeSut();
    const loadByTokenSpy = jest.spyOn(
      loadAccountByTokenRepositoryStub,
      "loadByToken"
    );
    await sut.load("any_token", "any_role");
    expect(loadByTokenSpy).toHaveBeenCalledWith("any_token", "any_role");
  });

  test("Should return null if LoadAccountByTokenRepository returns null", async () => {
    const { loadAccountByTokenRepositoryStub, sut } = makeSut();
    jest
      .spyOn(loadAccountByTokenRepositoryStub, "loadByToken")
      .mockReturnValueOnce(new Promise((resolve) => resolve(null)));
    const account = await sut.load("any_token", "any_role");
    expect(account).toBeNull();
  });

  test("Should return an account on success", async () => {
    const { sut } = makeSut();
    const account = await sut.load("any_token", "any_role");
    expect(account).toEqual(mockAccountModel());
  });

  test("Should throw if Decrypter throws", async () => {
    const { sut, decrypterStub } = makeSut();
    jest.spyOn(decrypterStub, "decrypt").mockImplementationOnce(throwError);
    const promise = sut.load("any_token", "any_role");
    await expect(promise).rejects.toThrow();
  });

  test("Should throw if LoadAccountByTokenRepository throws", async () => {
    const { sut, loadAccountByTokenRepositoryStub } = makeSut();
    jest
      .spyOn(loadAccountByTokenRepositoryStub, "loadByToken")
      .mockImplementationOnce(throwError);
    const promise = sut.load("any_token", "any_role");
    await expect(promise).rejects.toThrow();
  });
});
