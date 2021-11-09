import { Decrypter } from "../../protocols/criptography/decrypter";
import { DbLoadAccountByToken } from "./db-load-account-by-token";

const makeDecrypter = (): Decrypter => {
  class DecrypterStub implements Decrypter {
    async decrypt(value: string): Promise<string> {
      return new Promise((resolve) => resolve("any_value"));
    }
  }
  return new DecrypterStub();
};

interface SutTypes {
  sut: DbLoadAccountByToken;
  decrypterStub: Decrypter;
}

const makeSut = (): SutTypes => {
  const decrypterStub = makeDecrypter();
  const sut = new DbLoadAccountByToken(decrypterStub);
  return { sut, decrypterStub };
};

describe("DbLoadAccountByToken Usecase", () => {
  test("Should call Decrypter with correct values", async () => {
    const { decrypterStub, sut } = makeSut();
    const decyypterSpy = jest.spyOn(decrypterStub, "decrypt");
    await sut.load("any_token");
    expect(decyypterSpy).toHaveBeenCalledWith("any_token");
  });
});
