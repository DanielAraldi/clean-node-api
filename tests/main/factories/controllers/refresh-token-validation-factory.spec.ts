import { Validation } from '@/presentation/protocols';
import {
  RequiredFieldValidation,
  ValidationComposite,
} from '@/validation/validators';
import { makeRefreshTokenValidation } from '@/main/factories';

jest.mock('@/validation/validators/validation-composite');

describe('RefreshTokenValidation Factory', () => {
  test('Should call ValidationComposite with all validations', () => {
    makeRefreshTokenValidation();
    const validations: Validation[] = [];
    validations.push(new RequiredFieldValidation(['accessToken']));
    expect(ValidationComposite).toHaveBeenCalledWith(validations);
  });
});
