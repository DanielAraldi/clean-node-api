import { makeLoginValidation } from "./login-validation";
import { Validation } from "../../../presentation/protocols/validation";
import {
  RequiredFieldValidation,
  EmailValidation,
  ValidationComposite,
} from "../../../presentation/helpers/validators";
import { EmailValidator } from "../../../presentation/protocols/email-validator";

jest.mock("../../../presentation/helpers/validators/validation-composite");

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid(email: string): boolean {
      return true;
    }
  }
  return new EmailValidatorStub();
};

describe("LoginValidation Factory", () => {
  test("Should call ValidationComposite with all validations", () => {
    // Execute function that return ValidationComposite module
    makeLoginValidation();
    const validations: Validation[] = [];
    for (const field of ["email", "password"]) {
      validations.push(new RequiredFieldValidation(field));
    }
    validations.push(new EmailValidation("email", makeEmailValidator()));
    // Expect that ValidationComposite module to have called
    expect(ValidationComposite).toHaveBeenCalledWith(validations);
  });
});
