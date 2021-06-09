import { LoginController } from "./login";
import { HttpRequest, HttpResponse } from "../../protocols";
import { badRequest } from "../../helpers/http-helper";
import { MissingParamError } from "../../errors";

describe("Login Controller", () => {
  test("Should return 400 if no email is provided", async () => {
    const sut = new LoginController();
    const httpRequest: HttpRequest = {
      body: {
        password: "any_password",
      },
    };
    const httpResponse: HttpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(badRequest(new MissingParamError("email")));
  });
});
