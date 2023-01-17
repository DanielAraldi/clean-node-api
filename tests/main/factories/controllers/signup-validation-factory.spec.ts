import { Validation } from '@/presentation/protocols';
import { EmailValidatorAdapter } from '@/infra/validators';
import {
  RequiredFieldValidation,
  ValidationComposite,
  EmailValidation,
  CompareFieldsValidation,
} from '@/validation/validators';
import { makeSignUpValidation } from '@/main/factories';

jest.mock('@/validation/validators/validation-composite');

describe('SignUpValidation Factory', () => {
  test('Should call ValidationComposite with all validations', () => {
    makeSignUpValidation();
    const validations: Validation[] = [];
    validations.push(
      new RequiredFieldValidation([
        'name',
        'email',
        'password',
        'passwordConfirmation',
      ])
    );
    validations.push(
      new CompareFieldsValidation('password', 'passwordConfirmation')
    );
    validations.push(new EmailValidation('email', new EmailValidatorAdapter()));
    expect(ValidationComposite).toHaveBeenCalledWith(validations);
  });
});
