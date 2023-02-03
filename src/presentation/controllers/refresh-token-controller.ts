import { Controller, HttpResponse, Validation } from '@/presentation/protocols';
import { badRequest } from '@/presentation/helpers';

export class RefreshTokenController implements Controller {
  constructor(private readonly validation: Validation) {}

  async handle(request: RefreshTokenController.Request): Promise<HttpResponse> {
    const error = this.validation.validate(request);
    if (error) {
      return badRequest(error);
    }
    return Promise.resolve(null);
  }
}

export namespace RefreshTokenController {
  export type Request = {
    accessToken: string;
  };
}
