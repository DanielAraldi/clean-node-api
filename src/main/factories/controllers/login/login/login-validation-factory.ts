import { EmailValidatorAdapter } from "@/infra/validators/email-validator-adapter";
import { Validation } from "@/presentation/protocols/validation";
import {
  ValidationComposite,
  EmailValidation,
  RequiredFieldValidation,
} from "@/validation/validators";

export const makeLoginValidation = (): ValidationComposite => {
  const validations: Validation[] = [];
  validations.push(new RequiredFieldValidation(["email", "password"]));
  validations.push(new EmailValidation("email", new EmailValidatorAdapter()));
  return new ValidationComposite(validations);
};
