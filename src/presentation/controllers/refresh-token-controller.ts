import { Controller, HttpResponse, Validation } from '@/presentation/protocols';

export class RefreshTokenController implements Controller {
  constructor(private readonly validation: Validation) {}

  async handle(request: RefreshTokenController.Request): Promise<HttpResponse> {
    this.validation.validate(request);
    return Promise.resolve(null);
  }
}

export namespace RefreshTokenController {
  export type Request = {
    accessToken: string;
  };
}
