import { Validation } from "@/presentation/protocols/validation";
import {
  RequiredFieldValidation,
  ValidationComposite,
  EmailValidation,
  CompareFieldsValidation,
} from "@/validation/validators";
import { makeSignUpValidation } from "./signup-validation-factory";
import { mockEmailValidator } from "@/validation/tests";

jest.mock("@/validation/validators/validation-composite");

describe("SignUpValidation Factory", () => {
  test("Should call ValidationComposite with all validations", () => {
    makeSignUpValidation();
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
    validations.push(new EmailValidation("email", mockEmailValidator()));
    expect(ValidationComposite).toHaveBeenCalledWith(validations);
  });
});
