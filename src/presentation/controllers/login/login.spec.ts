import { LoginController } from "./login";
import { HttpRequest, HttpResponse } from "../../protocols";
import { badRequest } from "../../helpers/http-helper";
import { InvalidParamError, MissingParamError } from "../../errors";
import { EmailValidator } from "../signup/signup-protocols";

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid(email: string): boolean {
      return true;
    }
  }
  return new EmailValidatorStub();
};

const makeFakeRequest = (): HttpRequest => ({
  body: {
    email: "any_email@mail.com",
    password: "any_password",
  },
});

interface SutTypes {
  sut: LoginController;
  emailValidatorStub: EmailValidator;
}

const makeSut = (): SutTypes => {
  const emailValidatorStub = makeEmailValidator();
  const sut = new LoginController(emailValidatorStub);
  return { sut, emailValidatorStub };
};

describe("Login Controller", () => {
  test("Should return 400 if no email is provided", async () => {
    const { sut } = makeSut();
    const httpRequest: HttpRequest = {
      body: {
        password: "any_password",
      },
    };
    const httpResponse: HttpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(badRequest(new MissingParamError("email")));
  });

  test("Should return 400 if no password is provided", async () => {
    const { sut } = makeSut();
    const httpRequest: HttpRequest = {
      body: {
        email: "any_email@mail.com",
      },
    };
    const httpResponse: HttpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(badRequest(new MissingParamError("password")));
  });

  test("Should return 400 if an invalid email is provided", async () => {
    const { sut, emailValidatorStub } = makeSut();
    jest.spyOn(emailValidatorStub, "isValid").mockReturnValueOnce(false);
    const httpResponse: HttpResponse = await sut.handle(makeFakeRequest());
    expect(httpResponse).toEqual(badRequest(new InvalidParamError("email")));
  });

  test("Should call EmailValidator with correct email", async () => {
    const { sut, emailValidatorStub } = makeSut();
    const isValidSpy = jest.spyOn(emailValidatorStub, "isValid");
    await sut.handle(makeFakeRequest());
    expect(isValidSpy).toHaveBeenCalledWith("any_email@mail.com");
  });
});
