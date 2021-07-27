import { makeSignUpValidation } from "./signup-validation-factory";
import { Validation } from "../../../../presentation/protocols/validation";
import {
  RequiredFieldValidation,
  ValidationComposite,
  EmailValidation,
  CompareFieldsValidation,
} from "../../../../presentation/helpers/validators";
import { EmailValidator } from "../../../../presentation/protocols/email-validator";

jest.mock("../../../../presentation/helpers/validators/validation-composite");

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid(email: string): boolean {
      return true;
    }
  }
  return new EmailValidatorStub();
};

describe("SignUpValidation Factory", () => {
  test("Should call ValidationComposite with all validations", () => {
    // Execute function that return ValidationComposite module
    makeSignUpValidation();
    const validations: Validation[] = [];
    for (const field of ["name", "email", "password", "passwordConfirmation"]) {
      validations.push(new RequiredFieldValidation(field));
    }
    validations.push(
      new CompareFieldsValidation("password", "passwordConfirmation")
    );
    validations.push(new EmailValidation("email", makeEmailValidator()));
    // Expect that ValidationComposite module to have called
    expect(ValidationComposite).toHaveBeenCalledWith(validations);
  });
});
