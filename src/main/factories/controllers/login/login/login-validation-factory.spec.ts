import { Validation } from "@/presentation/protocols/validation";
import { mockEmailValidator } from "@/validation/tests";
import {
  RequiredFieldValidation,
  EmailValidation,
  ValidationComposite,
} from "@/validation/validators";
import { makeLoginValidation } from "./login-validation-factory";

jest.mock("@/validation/validators/validation-composite");

describe("LoginValidation Factory", () => {
  test("Should call ValidationComposite with all validations", () => {
    makeLoginValidation();
    const validations: Validation[] = [];
    validations.push(new RequiredFieldValidation(["email", "password"]));
    validations.push(new EmailValidation("email", mockEmailValidator()));
    expect(ValidationComposite).toHaveBeenCalledWith(validations);
  });
});
