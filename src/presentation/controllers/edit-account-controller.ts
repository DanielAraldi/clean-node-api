import { EditAccount } from '@/domain/usecases';
import { Controller, HttpResponse } from '@/presentation/protocols';
import { serverError } from '@/presentation/helpers';

export class EditAccountController implements Controller {
  constructor(private readonly editAccount: EditAccount) {}

  async handle(request: EditAccountController.Request): Promise<HttpResponse> {
    try {
      await this.editAccount.edit(request);
    } catch (error) {
      return serverError(error);
    }
  }
}

export namespace EditAccountController {
  export type Request = {
    name?: string;
    email?: string;
    accountId: string;
  };
}
