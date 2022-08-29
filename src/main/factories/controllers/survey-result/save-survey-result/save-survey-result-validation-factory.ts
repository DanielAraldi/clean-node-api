import { Validation } from "@/presentation/protocols";
import {
  RequiredFieldValidation,
  ValidationComposite,
} from "@/validation/validators";

export const makeSaveSurveyResultValidation = (): Validation => {
  const validations: Validation[] = [];
  validations.push(new RequiredFieldValidation(["answerId"]));
  return new ValidationComposite(validations);
};
