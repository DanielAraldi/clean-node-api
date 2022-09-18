import jwt from "jsonwebtoken";
import { JwtAdapter } from "./jwt-adapter";
import { throwError } from "@/domain/tests";

jest.mock("jsonwebtoken", () => ({
  sign(): string {
    return "any_token";
  },

  verify(): string {
    return "any_value";
  },
}));

const makeSut = (): JwtAdapter => new JwtAdapter("secret");

describe("Jwt Adapter", () => {
  describe("sign()", () => {
    test("Should call sign with correct values", async () => {
      const sut = makeSut();
      const signSpy = jest.spyOn(jwt, "sign");
      sut.encrypt("any_id");
      expect(signSpy).toHaveBeenCalledWith({ id: "any_id" }, "secret");
    });

    test("Should return a token on sign success", async () => {
      const sut = makeSut();
      const accessToken = sut.encrypt("any_id");
      expect(accessToken).toBe("any_token");
    });

    test("Should throw if sign throws", async () => {
      const sut = makeSut();
      jest.spyOn(jwt, "sign").mockImplementationOnce(async () => throwError());
      const error = sut.encrypt("any_id");
      await expect(error).rejects.toThrow();
    });
  });

  describe("verify()", () => {
    test("Should call verify with correct values", async () => {
      const sut = makeSut();
      const verifySpy = jest.spyOn(jwt, "verify");
      sut.decrypt("any_token");
      expect(verifySpy).toHaveBeenCalledWith("any_token", "secret");
    });

    test("Should return a value on verify syccess", async () => {
      const sut = makeSut();
      const value = sut.decrypt("any_token");
      expect(value).toBe("any_value");
    });

    test("Should throw if verify throws", async () => {
      const sut = makeSut();
      jest
        .spyOn(jwt, "verify")
        .mockImplementationOnce(async () => throwError());
      const error = sut.decrypt("any_token");
      await expect(error).rejects.toThrow();
    });
  });
});
