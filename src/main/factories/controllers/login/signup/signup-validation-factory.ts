import { EmailValidatorAdapter } from "@/infra/validators/email-validator-adapter";
import { Validation } from "@/presentation/protocols/validation";
import {
  ValidationComposite,
  CompareFieldsValidation,
  EmailValidation,
  RequiredFieldValidation,
} from "@/validation/validators";

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
