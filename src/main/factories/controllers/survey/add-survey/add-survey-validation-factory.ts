import { Validation } from "@/presentation/protocols/validation";
import {
  ValidationComposite,
  RequiredFieldValidation,
} from "@/validation/validators";

export const makeAddSurveyValidation = (): ValidationComposite => {
  const validations: Validation[] = [];
  validations.push(new RequiredFieldValidation(["question", "answers"]));
  return new ValidationComposite(validations);
};
