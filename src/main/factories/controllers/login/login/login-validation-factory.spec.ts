import { Validation } from "@/presentation/protocols/validation";
import {
  RequiredFieldValidation,
  EmailValidation,
  ValidationComposite,
} from "@/validation/validators";
import { EmailValidator } from "@/validation/protocols/email-validator";
import { makeLoginValidation } from "./login-validation-factory";

jest.mock("@/validation/validators/validation-composite");

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
    makeLoginValidation();
    const validations: Validation[] = [];
    validations.push(new RequiredFieldValidation(["email", "password"]));
    validations.push(new EmailValidation("email", makeEmailValidator()));
    expect(ValidationComposite).toHaveBeenCalledWith(validations);
  });
});
