import { Validation } from '@/presentation/protocols';
import { EmailValidatorAdapter } from '@/infra/validators';
import {
  EmailValidation,
  RequiredFieldValidation,
  ValidationComposite,
} from '@/validation/validators';

export const makeLoginValidation = (): ValidationComposite => {
  const validations: Validation[] = [];
  validations.push(new RequiredFieldValidation(['email', 'password']));
  validations.push(new EmailValidation('email', new EmailValidatorAdapter()));
  return new ValidationComposite(validations);
};
