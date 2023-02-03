import { Controller, HttpResponse, Validation } from '@/presentation/protocols';
import { badRequest } from '@/presentation/helpers';
import { RefreshToken } from '@/domain/usecases';

export class RefreshTokenController implements Controller {
  constructor(
    private readonly validation: Validation,
    private readonly refreshToken: RefreshToken
  ) {}

  async handle(request: RefreshTokenController.Request): Promise<HttpResponse> {
    const error = this.validation.validate(request);
    if (error) {
      return badRequest(error);
    }
    const { accessToken } = request;
    await this.refreshToken.refresh(accessToken);
    return Promise.resolve(null);
  }
}

export namespace RefreshTokenController {
  export type Request = {
    accessToken: string;
  };
}
