import { Validation } from '@/presentation/protocols';
import {
  ValidationComposite,
  RequiredFieldValidation,
  MultipleValuesValidation,
  LengthFieldValidation,
} from '@/validation/validators';

export const makeAddSurveyValidation = (): ValidationComposite => {
  const validations: Validation[] = [];
  validations.push(new RequiredFieldValidation(['question', 'answers']));
  validations.push(
    new MultipleValuesValidation('answers', [
      new RequiredFieldValidation(['answer']),
    ])
  );
  validations.push(new LengthFieldValidation('answers', 2));
  return new ValidationComposite(validations);
};
