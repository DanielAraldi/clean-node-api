import {
  Hasher,
  AddAccountParams,
  AccountModel,
  AddAccountRepository,
  LoadAccountByEmailRepository,
} from "./db-add-account-protocols";
import { DbAddAccount } from "./db-add-account";
import {
  mockAccountModel,
  mockAddAccountParams,
  throwError,
} from "@/domain/tests";

const makeHasher = (): Hasher => {
  class HasherStub implements Hasher {
    async hash(value: string): Promise<string> {
      return new Promise((resolve) => resolve("hashed_password"));
    }
  }
  return new HasherStub();
};

const makeLoadAccountByEmailRepository = (): LoadAccountByEmailRepository => {
  class LoadAccountByEmailRepositoryStub
    implements LoadAccountByEmailRepository
  {
    async loadByEmail(email: string): Promise<AccountModel | null> {
      return new Promise((resolve) => resolve(null));
    }
  }
  return new LoadAccountByEmailRepositoryStub();
};

const makeAddAccountRepository = (): AddAccountRepository => {
  class AddAccountRepositoryStub implements AddAccountRepository {
    async add(accountData: AddAccountParams): Promise<AccountModel> {
      return new Promise((resolve) => resolve(mockAccountModel()));
    }
  }
  return new AddAccountRepositoryStub();
};

type SutTypes = {
  sut: DbAddAccount;
  hasherStub: Hasher;
  addAccountRepositoryStub: AddAccountRepository;
  loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository;
};

const makeSut = (): SutTypes => {
  const hasherStub = makeHasher();
  const addAccountRepositoryStub = makeAddAccountRepository();
  const loadAccountByEmailRepositoryStub = makeLoadAccountByEmailRepository();
  const sut = new DbAddAccount(
    hasherStub,
    addAccountRepositoryStub,
    loadAccountByEmailRepositoryStub
  );
  return {
    sut,
    hasherStub,
    addAccountRepositoryStub,
    loadAccountByEmailRepositoryStub,
  };
};

describe("DbAddAccount Usecase", () => {
  test("Should call Hasher with correct password", async () => {
    const { sut, hasherStub } = makeSut();
    const hashSpy = jest.spyOn(hasherStub, "hash");
    await sut.add(mockAddAccountParams());
    expect(hashSpy).toHaveBeenCalledWith("any_password");
  });

  test("Should throw if Hasher throws", async () => {
    const { sut, hasherStub } = makeSut();
    jest.spyOn(hasherStub, "hash").mockImplementationOnce(throwError);
    const promise = sut.add(mockAddAccountParams());
    await expect(promise).rejects.toThrow();
  });

  test("Should call addAccountRepository with correct values", async () => {
    const { sut, addAccountRepositoryStub } = makeSut();
    const addSpy = jest.spyOn(addAccountRepositoryStub, "add");
    await sut.add(mockAddAccountParams());
    expect(addSpy).toHaveBeenCalledWith({
      name: "any_name",
      email: "any_mail@mail.com",
      password: "hashed_password",
    });
  });

  test("Should throw if AddAccountRepository throws", async () => {
    const { sut, addAccountRepositoryStub } = makeSut();
    jest
      .spyOn(addAccountRepositoryStub, "add")
      .mockImplementationOnce(throwError);
    const promise = sut.add(mockAddAccountParams());
    await expect(promise).rejects.toThrow();
  });

  test("Should return an account on success", async () => {
    const { sut } = makeSut();
    const account = await sut.add(mockAddAccountParams());
    expect(account).toEqual(mockAccountModel());
  });

  test("Should return null if loadAccountByEmailRepositoryStub not return null", async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut();
    jest
      .spyOn(loadAccountByEmailRepositoryStub, "loadByEmail")
      .mockReturnValueOnce(
        new Promise((resolve) => resolve(mockAccountModel()))
      );
    const account = await sut.add(mockAddAccountParams());
    expect(account).toBeNull();
  });

  test("Should call LoadAccountByEmailRepository with correct email", async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut();
    const loadSpy = jest.spyOn(loadAccountByEmailRepositoryStub, "loadByEmail");
    await sut.add(mockAddAccountParams());
    expect(loadSpy).toHaveBeenCalledWith("any_mail@mail.com");
  });
});
