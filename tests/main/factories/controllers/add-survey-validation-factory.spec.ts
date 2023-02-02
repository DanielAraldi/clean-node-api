import { Validation } from '@/presentation/protocols';
import {
  MultipleValuesValidation,
  RequiredFieldValidation,
  ValidationComposite,
  LengthFieldValidation,
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
    validations.push(new LengthFieldValidation('answers', 2));
    expect(ValidationComposite).toHaveBeenCalledWith(validations);
  });
});
