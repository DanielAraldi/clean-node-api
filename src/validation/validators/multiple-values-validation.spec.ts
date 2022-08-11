import { MissingParamError } from "@/presentation/errors/missing-param-error";
import { Validation } from "@/presentation/protocols";
import { MultipleValuesValidation } from "./multiple-values-validation";

describe("Multiple Values Validation", () => {
  test("Should return a MissingParamError if object fieldname validation fails", () => {
    class ValidationStub implements Validation {
      constructor(private readonly fieldNames: string[]) {}
      validate(input: any): Error | null {
        return null;
      }
    }
    const validationStub = new ValidationStub(["field"]);
    jest
      .spyOn(validationStub, "validate")
      .mockReturnValueOnce(new MissingParamError("objectFieldName"));
    const sut = new MultipleValuesValidation("objectFieldName", [
      validationStub,
    ]);
    const error = sut.validate({ invalidField: [{ field: "any_value" }] });
    expect(error).toEqual(new MissingParamError("objectFieldName"));
  });
});
