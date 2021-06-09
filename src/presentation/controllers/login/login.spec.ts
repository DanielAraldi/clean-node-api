import { LoginController } from "./login";
import { HttpRequest, HttpResponse } from "../../protocols";
import { badRequest } from "../../helpers/http-helper";
import { MissingParamError } from "../../errors";

interface SutTypes {
  sut: LoginController;
}

const makeSut = (): SutTypes => {
  const sut = new LoginController();
  return { sut };
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
});
