import { LoadAccount } from '@/domain/usecases';
import { Controller, HttpResponse } from '@/presentation/protocols';

export class LoadAccountController implements Controller {
  constructor(private readonly loadAccount: LoadAccount) {}

  async handle(request: LoadAccountController.Request): Promise<HttpResponse> {
    await this.loadAccount.load(request.accountId);
    return null;
  }
}

export namespace LoadAccountController {
  export type Request = {
    accountId: string;
  };
}
