import { Validation } from "@/presentation/protocols/validation";
import {
  RequiredFieldValidation,
  ValidationComposite,
} from "@/validation/validators";
import { makeSaveSurveyResultValidation } from "./save-survey-result-validation-factory";

jest.mock("@/validation/validators/validation-composite");

describe("SaveSurveyResultValidation Factory", () => {
  test("Should call ValidationComposite with all validations", () => {
    makeSaveSurveyResultValidation();
    const validations: Validation[] = [];
    validations.push(new RequiredFieldValidation(["answerId"]));
    expect(ValidationComposite).toHaveBeenCalledWith(validations);
  });
});
