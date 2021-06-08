import bcrypt from "bcrypt";
import { BcryptAdapter } from "./bcrypt-adapter";

jest.mock("bcrypt", () => ({
  async hash(): Promise<string> {
    return new Promise((resolve) => resolve("hash"));
  },
}));

const salt = 12;

const makeSut = (): BcryptAdapter => new BcryptAdapter(salt);

describe("Bcrypt Adapter", () => {
  test("Should call bcrypt with correct values", async () => {
    const hashSpy = jest.spyOn(bcrypt, "hash");
    const sut = makeSut();
    await sut.encrypt("any_value");
    expect(hashSpy).toHaveBeenCalledWith("any_value", salt);
  });

  test("Should return a hash on success", async () => {
    const sut = makeSut();
    const hash = await sut.encrypt("any_value");
    expect(hash).toBe("hash");
  });

  test("Should throw if bcrypt throws", async () => {
    const sut = makeSut();
    // jest.spyOn(bcrypt, "hash").mockImplementationOnce(() => {
    //   return new Promise((resolve, reject) => reject(new Error()));
    // });

    jest.spyOn(bcrypt, "hash").mockImplementationOnce(() => {
      return new Promise((resolve, reject) => reject(new Error()));
    });
    const promise = sut.encrypt("any_value");
    await expect(promise).rejects.toThrow();
  });
});
