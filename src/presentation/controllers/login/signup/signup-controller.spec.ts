import { SignUpController } from "./signup-controller";
import {
  AccountModel,
  AddAccount,
  AddAccountParams,
  Authentication,
  AuthenticationParams,
  HttpResponse,
  HttpRequest,
  Validation,
  MissingParamError,
  ServerError,
  EmailInUseError,
  ok,
  badRequest,
  serverError,
  forbidden,
} from "./signup-controller-protocols";
import { throwError } from "@/domain/tests";

const makeAddAccount = (): AddAccount => {
  class AddAccountStub implements AddAccount {
    async add(account: AddAccountParams): Promise<AccountModel | null> {
      return new Promise((resolve) => resolve(makeFakeAccount()));
    }
  }
  return new AddAccountStub();
};

const makeAuthentication = (): Authentication => {
  class AuthenticationStub implements Authentication {
    async auth(authentication: AuthenticationParams): Promise<string | null> {
      return new Promise((resolve) => resolve("any_token"));
    }
  }
  return new AuthenticationStub();
};

const makeValidation = (): Validation => {
  class validationStub implements Validation {
    validate(input: any): Error | null {
      return null;
    }
  }
  return new validationStub();
};

const makeFakeAccount = (): AccountModel => ({
  id: "valid_id",
  name: "valid_name",
  email: "valid_email@mail.com",
  password: "valid_password",
});

const makeFakeRequest = (): HttpRequest => ({
  body: {
    name: "any_name",
    email: "any_email@mail.com",
    password: "any_password",
    passwordConfirmation: "any_password",
  },
});

type SutTypes = {
  sut: SignUpController;
  addAccountStub: AddAccount;
  authenticationStub: Authentication;
  validationStub: Validation;
};

const makeSut = (): SutTypes => {
  const addAccountStub = makeAddAccount();
  const authenticationStub = makeAuthentication();
  const validationStub = makeValidation();
  const sut = new SignUpController(
    addAccountStub,
    validationStub,
    authenticationStub
  );
  return { sut, addAccountStub, authenticationStub, validationStub };
};

describe("SignUp Controller", () => {
  test("Should return 500 if AddAccount throws", async () => {
    const { sut, addAccountStub } = makeSut();
    jest.spyOn(addAccountStub, "add").mockImplementationOnce(throwError);
    const httpResponse = await sut.handle(makeFakeRequest());
    expect(httpResponse).toEqual(serverError(new ServerError("")));
  });

  test("Should call AddAccount with correct values", async () => {
    const { sut, addAccountStub } = makeSut();
    const addSpy = jest.spyOn(addAccountStub, "add");
    await sut.handle(makeFakeRequest());
    expect(addSpy).toHaveBeenCalledWith({
      name: "any_name",
      email: "any_email@mail.com",
      password: "any_password",
    });
  });

  test("Should return 403 if AddAccount returns null", async () => {
    const { sut, addAccountStub } = makeSut();
    jest
      .spyOn(addAccountStub, "add")
      .mockReturnValueOnce(new Promise((resolve) => resolve(null)));
    const httpResponse = await sut.handle(makeFakeRequest());
    expect(httpResponse).toEqual(forbidden(new EmailInUseError()));
  });

  test("Should return 200 if valid data is provided", async () => {
    const { sut } = makeSut();
    const httpResponse = await sut.handle(makeFakeRequest());
    expect(httpResponse).toEqual(ok({ accessToken: "any_token" }));
  });

  test("Should call Validation with correct value", async () => {
    const { sut, validationStub } = makeSut();
    const validateSpy = jest.spyOn(validationStub, "validate");
    const httpRequest: HttpRequest = makeFakeRequest();
    await sut.handle(httpRequest);
    expect(validateSpy).toHaveBeenCalledWith(httpRequest.body);
  });

  test("Should return 400 if Validation returns an error", async () => {
    const { sut, validationStub } = makeSut();
    jest
      .spyOn(validationStub, "validate")
      .mockReturnValueOnce(new MissingParamError("any_field"));
    const httpResponse = await sut.handle(makeFakeRequest());
    expect(httpResponse).toEqual(
      badRequest(new MissingParamError("any_field"))
    );
  });

  test("Should call Authentication with correct values", async () => {
    const { sut, authenticationStub } = makeSut();
    const authSpy = jest.spyOn(authenticationStub, "auth");
    await sut.handle(makeFakeRequest());
    expect(authSpy).toHaveBeenCalledWith({
      email: "any_email@mail.com",
      password: "any_password",
    });
  });

  test("Should returns 500 if Authentication throws", async () => {
    const { sut, authenticationStub } = makeSut();
    jest.spyOn(authenticationStub, "auth").mockImplementationOnce(throwError);
    const httpResponse: HttpResponse = await sut.handle(makeFakeRequest());
    expect(httpResponse).toEqual(serverError(new Error()));
  });
});
