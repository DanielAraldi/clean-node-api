import { Controller, HttpResponse, Validation } from '@/presentation/protocols';
import {
  badRequest,
  ok,
  serverError,
  unauthorized,
} from '@/presentation/helpers';
import { RefreshToken } from '@/domain/usecases';

export class RefreshTokenController implements Controller {
  constructor(
    private readonly validation: Validation,
    private readonly refreshToken: RefreshToken
  ) {}

  async handle(request: RefreshTokenController.Request): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(request);
      if (error) {
        return badRequest(error);
      }
      const { accessToken } = request;
      const result = await this.refreshToken.refresh(accessToken);
      if (!result) {
        return unauthorized();
      }
      return ok(result);
    } catch (error) {
      return serverError(error);
    }
  }
}

export namespace RefreshTokenController {
  export type Request = {
    accessToken: string;
  };
}
