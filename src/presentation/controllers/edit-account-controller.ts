import { EditAccount } from '@/domain/usecases';
import { Controller, HttpResponse } from '@/presentation/protocols';
import { forbidden, serverError } from '@/presentation/helpers';
import { EmailInUseError } from '@/presentation/errors';

export class EditAccountController implements Controller {
  constructor(private readonly editAccount: EditAccount) {}

  async handle(request: EditAccountController.Request): Promise<HttpResponse> {
    try {
      const result = await this.editAccount.edit(request);
      if (!result) {
        return forbidden(new EmailInUseError());
      }
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
