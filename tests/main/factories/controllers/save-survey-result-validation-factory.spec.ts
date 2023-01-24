import { Validation } from '@/presentation/protocols';
import {
  RequiredFieldValidation,
  ValidationComposite,
} from '@/validation/validators';
import { makeSaveSurveyResultValidation } from '@/main/factories';

jest.mock('@/validation/validators/validation-composite');

describe('SaveSurveyResultValidation Factory', () => {
  test('Should call ValidationComposite with all validations', () => {
    makeSaveSurveyResultValidation();
    const validations: Validation[] = [];
    validations.push(new RequiredFieldValidation(['answerId']));
    expect(ValidationComposite).toHaveBeenCalledWith(validations);
  });
});
