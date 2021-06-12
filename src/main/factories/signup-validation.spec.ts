import { RequiredFieldValidation } from "../../presentation/helpers/validators/required-field-validation";
import { Validation } from "../../presentation/helpers/validators/validation";
import { ValidationComposite } from "../../presentation/helpers/validators/validation-composite";
import { makeSignUpValidation } from "./signup-validation";

jest.mock("../../presentation/helpers/validators/validation-composite");

describe("SignUpValidation Factory", () => {
  test("Should call ValidationComposite with all validations", () => {
    // Execute function that return ValidationComposite module
    makeSignUpValidation();
    const validations: Validation[] = [];
    for (const field of ["name", "email", "password", "passwordConfirmation"]) {
      validations.push(new RequiredFieldValidation(field));
    }
    // Expect that ValidationComposite module to have called
    expect(ValidationComposite).toHaveBeenCalledWith(validations);
  });
});
