import { MissingParamError } from "@/presentation/errors/missing-param-error";
import { Validation } from "@/presentation/protocols";
import { mockValidation } from "@/validation/tests";
import { MultipleValuesValidation } from "./multiple-values-validation";

type SutTypes = {
  sut: MultipleValuesValidation;
  validationStub: Validation;
};

const makeSut = (): SutTypes => {
  const validationStub = mockValidation();
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

  test("Should not return if validation succeds", () => {
    const { sut } = makeSut();
    const error = sut.validate({
      objectFieldName: [{ field: "any_value" }],
    });
    expect(error).toBeNull();
  });
});
