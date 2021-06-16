import { MissingParamError } from "../../errors";
import { RequiredFieldValidation } from "./required-field-validation";

describe("Required Field Validation", () => {
  test("Should return a MissingParamError if validation fails", () => {
    const sut = new RequiredFieldValidation("field");
    const error = sut.validate({ invalidField: "any_data" });
    expect(error).toEqual(new MissingParamError("field"));
  });
});
