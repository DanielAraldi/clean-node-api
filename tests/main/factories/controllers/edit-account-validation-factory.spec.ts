import { Validation } from '@/presentation/protocols';
import {
  RequiredFieldValidation,
  ValidationComposite,
  AlmostRequiredFieldValidation,
} from '@/validation/validators';
import { makeEditAccountValidation } from '@/main/factories';

jest.mock('@/validation/validators/validation-composite');

describe('EditAccountValidation Factory', () => {
  test('Should call ValidationComposite with all validations', () => {
    makeEditAccountValidation();
    const validations: Validation[] = [];
    validations.push(new RequiredFieldValidation(['accountId']));
    validations.push(new AlmostRequiredFieldValidation(['name', 'email']));
    expect(ValidationComposite).toHaveBeenCalledWith(validations);
  });
});
