import { Validation } from '@/presentation/protocols';
import {
  ValidationComposite,
  AlmostRequiredFieldValidation,
  RequiredFieldValidation,
} from '@/validation/validators';

export const makeEditAccountValidation = (): ValidationComposite => {
  const validations: Validation[] = [];
  validations.push(new RequiredFieldValidation(['accountId']));
  validations.push(new AlmostRequiredFieldValidation(['name', 'email']));
  return new ValidationComposite(validations);
};
