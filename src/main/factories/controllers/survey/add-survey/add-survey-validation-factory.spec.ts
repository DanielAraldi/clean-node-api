import { Validation } from "@/presentation/protocols/validation";
import {
  RequiredFieldValidation,
  ValidationComposite,
} from "@/validation/validators";
import { makeAddSurveyValidation } from "./add-survey-validation-factory";

jest.mock("@/validation/validators/validation-composite");

describe("AddSurveyValidation Factory", () => {
  test("Should call ValidationComposite with all validations", () => {
    makeAddSurveyValidation();
    const validations: Validation[] = [];
    validations.push(new RequiredFieldValidation(["question", "answers"]));
    expect(ValidationComposite).toHaveBeenCalledWith(validations);
  });
});
