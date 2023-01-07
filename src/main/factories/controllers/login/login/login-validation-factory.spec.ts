import { Validation } from '@/presentation/protocols/validation';
import { EmailValidatorAdapter } from '@/infra/validators/email-validator-adapter';
import {
  RequiredFieldValidation,
  EmailValidation,
  ValidationComposite,
} from '@/validation/validators';
import { makeLoginValidation } from './login-validation-factory';

jest.mock('@/validation/validators/validation-composite');

describe('LoginValidation Factory', () => {
  test('Should call ValidationComposite with all validations', () => {
    makeLoginValidation();
    const validations: Validation[] = [];
    validations.push(new RequiredFieldValidation(['email', 'password']));
    validations.push(new EmailValidation('email', new EmailValidatorAdapter()));
    expect(ValidationComposite).toHaveBeenCalledWith(validations);
  });
});
