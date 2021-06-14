import { ValidationComposite } from "../../presentation/helpers/validators/validation-composite";
import { Validation } from "../../presentation/helpers/validators/validation";
import { CompareFieldsValidation } from "../../presentation/helpers/validators/compare-fields-validation";
import { EmailValidation } from "../../presentation/helpers/validators/email-validation";
import { RequiredFieldValidation } from "../../presentation/helpers/validators/required-field-validation";
import { EmailValidatorAdapter } from "../../utils/email-validator-adapter";

export const makeSignUpValidation = (): ValidationComposite => {
  const validations: Validation[] = [];
  for (const field of ["name", "email", "password", "passwordConfirmation"]) {
    validations.push(new RequiredFieldValidation(field));
  }
  validations.push(
    new CompareFieldsValidation("password", "passwordConfirmation")
  );
  validations.push(new EmailValidation("email", new EmailValidatorAdapter()));
  return new ValidationComposite(validations);
};
