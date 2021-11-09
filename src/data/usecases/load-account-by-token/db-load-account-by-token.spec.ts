import { Decrypter } from "../../protocols/criptography/decrypter";
import { DbLoadAccountByToken } from "./db-load-account-by-token";

describe("DbLoadAccountByToken Usecase", () => {
  test("Should call Decrypter with correct values", async () => {
    class DecrypterStub implements Decrypter {
      async decrypt(value: string): Promise<string> {
        return new Promise((resolve) => resolve("any_value"));
      }
    }
    const decrypterStub = new DecrypterStub();
    const decyypterSpy = jest.spyOn(decrypterStub, "decrypt");
    const sut = new DbLoadAccountByToken(decrypterStub);
    await sut.load("any_token");
    expect(decyypterSpy).toHaveBeenCalledWith("any_token");
  });
});
