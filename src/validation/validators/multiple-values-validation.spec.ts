import { MissingParamError } from "@/presentation/errors/missing-param-error";
import { Validation } from "@/presentation/protocols";
import { MultipleValuesValidation } from "./multiple-values-validation";

const makeValidation = (): Validation => {
  class ValidationStub implements Validation {
    validate(input: any): Error | null {
      return null;
    }
  }
  return new ValidationStub();
};

type SutTypes = {
  sut: MultipleValuesValidation;
  validationStub: Validation;
};

const makeSut = (): SutTypes => {
  const validationStub = makeValidation();
  const sut = new MultipleValuesValidation("objectFieldName", [validationStub]);
  return { sut, validationStub };
};

describe("Multiple Values Validation", () => {
  test("Should return a MissingParamError if objectFieldName validation fails", () => {
    const { sut, validationStub } = makeSut();
    jest
      .spyOn(validationStub, "validate")
      .mockReturnValueOnce(new MissingParamError("objectFieldName"));
    const error = sut.validate({ invalidField: [{ field: "any_value" }] });
    expect(error).toEqual(new MissingParamError("objectFieldName"));
  });

  test("Should return a MissingParamError if fieldNames validation fails", () => {
    const { sut, validationStub } = makeSut();
    jest
      .spyOn(validationStub, "validate")
      .mockReturnValueOnce(new MissingParamError("field"));
    const error = sut.validate({
      objectFieldName: [{ invalidField: "any_value" }],
    });
    expect(error).toEqual(new MissingParamError("field"));
  });
});
