import { EditAccount } from '@/domain/usecases';
import { Controller, HttpResponse, Validation } from '@/presentation/protocols';
import {
  badRequest,
  forbidden,
  noContent,
  serverError,
} from '@/presentation/helpers';
import { EmailInUseError } from '@/presentation/errors';

export class EditAccountController implements Controller {
  constructor(
    private readonly validation: Validation,
    private readonly editAccount: EditAccount
  ) {}

  async handle(request: EditAccountController.Request): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(request);
      if (error) {
        return badRequest(error);
      }
      const result = await this.editAccount.edit({
        ...request,
        updatedAt: new Date(),
      });
      if (!result) {
        return forbidden(new EmailInUseError());
      }
      return noContent();
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
