import { Validation } from '@/presentation/protocols';
import {
  MultipleValuesValidation,
  RequiredFieldValidation,
  ValidationComposite,
} from '@/validation/validators';
import { makeAddSurveyValidation } from '@/main/factories';

jest.mock('@/validation/validators/validation-composite');

describe('AddSurveyValidation Factory', () => {
  test('Should call ValidationComposite with all validations', () => {
    makeAddSurveyValidation();
    const validations: Validation[] = [];
    validations.push(new RequiredFieldValidation(['question', 'answers']));
    validations.push(
      new MultipleValuesValidation('answers', [
        new RequiredFieldValidation(['answer']),
      ])
    );
    expect(ValidationComposite).toHaveBeenCalledWith(validations);
  });
});