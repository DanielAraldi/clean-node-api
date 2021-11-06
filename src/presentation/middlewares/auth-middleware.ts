import { LoadAccountByToken } from "../../domain/usecases/load-account-by-token";
import { AccessDeniedError } from "../errors";
import { forbidden } from "../helpers/http/http-helper";
import { Middleware, HttpRequest, HttpResponse } from "../protocols";

export class AuthMiddleware implements Middleware {
  constructor(private readonly loadAccountByToken: LoadAccountByToken) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    const accessToken = httpRequest.headers?.["x-access-token"];
    if (accessToken) {
      await this.loadAccountByToken.load(accessToken);
    }
    return forbidden(new AccessDeniedError());
  }
}
