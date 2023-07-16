import {
  makeEditAccountValidation,
  makeLogControllerDecorator,
  makeDbEditAccount,
} from '@/main/factories';
import { Controller } from '@/presentation/protocols';
import { EditAccountController } from '@/presentation/controllers';

export const makeEditAccountController = (): Controller => {
  const controller = new EditAccountController(
    makeEditAccountValidation(),
    makeDbEditAccount()
  );
  return makeLogControllerDecorator(controller);
};
