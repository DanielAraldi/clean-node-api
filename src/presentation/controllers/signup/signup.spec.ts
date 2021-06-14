import { SignUpController } from "./signup";
import { MissingParamError, ServerError } from "../../errors";
import {
  AccountModel,
  AddAccount,
  AddAccountModel,
  HttpRequest,
  Validation,
} from "./signup-protocols";
import { ok, badRequest, serverError } from "../../helpers/http-helper";

const makeAddAccount = (): AddAccount => {
  class AddAccountStub implements AddAccount {
    async add(account: AddAccountModel): Promise<AccountModel> {
      return new Promise((resolve) => resolve(makeFakeAccount()));
    }
  }
  return new AddAccountStub();
};

const makeValidation = (): Validation => {
  class validationStub implements Validation {
    validate(input: any): Error {
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

interface SutTypes {
  sut: SignUpController;
  addAccountStub: AddAccount;
  validationStub: Validation;
}

const makeSut = (): SutTypes => {
  const addAccountStub = makeAddAccount();
  const validationStub = makeValidation();
  const sut = new SignUpController(addAccountStub, validationStub);
  return { sut, addAccountStub, validationStub };
};

describe("SignUp Controller", () => {
  // Check if was AddAccount Internal Server Error
  test("Should return 500 if AddAccount throws", async () => {
    const { sut, addAccountStub } = makeSut();
    // Implements a function to be returned
    jest.spyOn(addAccountStub, "add").mockImplementationOnce(async () => {
      return new Promise((resolve, rejects) => rejects(new Error()));
    });
    const httpResponse = await sut.handle(makeFakeRequest());
    expect(httpResponse).toEqual(serverError(new ServerError(null)));
  });

  // Check if the data was passed correctly
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

  // Sucess
  test("Should return 200 if valid data is provided", async () => {
    const { sut } = makeSut();
    const httpResponse = await sut.handle(makeFakeRequest());
    expect(httpResponse).toEqual(ok(makeFakeAccount()));
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
});
