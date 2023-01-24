import { Validation } from '@/presentation/protocols';
import { EmailValidatorAdapter } from '@/infra/validators';
import {
  RequiredFieldValidation,
  EmailValidation,
  ValidationComposite,
} from '@/validation/validators';
import { makeLoginValidation } from '@/main/factories';

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
