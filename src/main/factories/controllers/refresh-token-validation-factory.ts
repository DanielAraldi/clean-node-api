import { Validation } from '@/presentation/protocols';
import {
  RequiredFieldValidation,
  ValidationComposite,
} from '@/validation/validators';

export const makeRefreshTokenValidation = (): ValidationComposite => {
  const validations: Validation[] = [];
  validations.push(new RequiredFieldValidation(['accessToken']));
  return new ValidationComposite(validations);
};
