import { EmailValidatorAdapter } from "@/infra/validators/email-validator-adapter";
import { Validation } from "@/presentation/protocols/validation";
import {
  ValidationComposite,
  EmailValidation,
  RequiredFieldValidation,
} from "@/validation/validators";

export const makeLoginValidation = (): ValidationComposite => {
  const validations: Validation[] = [];
  for (const field of ["email", "password"]) {
    validations.push(new RequiredFieldValidation(field));
  }
  validations.push(new EmailValidation("email", new EmailValidatorAdapter()));
  return new ValidationComposite(validations);
};
