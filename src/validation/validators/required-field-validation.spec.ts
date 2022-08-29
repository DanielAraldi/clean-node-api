import { MissingParamError } from "@/presentation/errors";
import { RequiredFieldValidation } from "./required-field-validation";

const makeSut = (): RequiredFieldValidation =>
  new RequiredFieldValidation(["field"]);

describe("Required Field Validation", () => {
  test("Should return a MissingParamError if validation fails", () => {
    const sut = makeSut();
    const error = sut.validate({ invalidField: "any_value" });
    expect(error).toEqual(new MissingParamError("field"));
  });

  test("Should not return if validation succeds", () => {
    const sut = makeSut();
    const error = sut.validate({ field: "any_value" });
    expect(error).toBeNull();
  });
});
