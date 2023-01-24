import { Validation } from '@/presentation/protocols';
import {
  ValidationComposite,
  RequiredFieldValidation,
  MultipleValuesValidation,
} from '@/validation/validators';

export const makeAddSurveyValidation = (): ValidationComposite => {
  const validations: Validation[] = [];
  validations.push(new RequiredFieldValidation(['question', 'answers']));
  validations.push(
    new MultipleValuesValidation('answers', [
      new RequiredFieldValidation(['answer']),
    ])
  );
  return new ValidationComposite(validations);
};
