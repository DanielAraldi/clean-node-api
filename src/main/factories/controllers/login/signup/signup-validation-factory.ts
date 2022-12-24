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
  validations.push(
    new RequiredFieldValidation([
      "name",
      "email",
      "password",
      "passwordConfirmation"
    ])
  );
  validations.push(
    new CompareFieldsValidation("password", "passwordConfirmation")
  );
  validations.push(new EmailValidation("email", new EmailValidatorAdapter()));
  return new ValidationComposite(validations);
};
