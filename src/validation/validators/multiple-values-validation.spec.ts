import { MissingParamError } from '@/presentation/errors/missing-param-error';
import { ValidationSpy } from '@/presentation/tests';
import { faker } from '@faker-js/faker';
import { MultipleValuesValidation } from './multiple-values-validation';

const objectField = faker.random.word();
const field = faker.random.word();

type SutTypes = {
  sut: MultipleValuesValidation;
  validationSpy: ValidationSpy;
};

const makeSut = (): SutTypes => {
  const validationSpy = new ValidationSpy();
  const sut = new MultipleValuesValidation(objectField, [validationSpy]);
  return { sut, validationSpy };
};

describe('Multiple Values Validation', () => {
  test('Should return a MissingParamError if objectField validation fails', () => {
    const { sut, validationSpy } = makeSut();
    validationSpy.error = new MissingParamError(objectField);
    const error = sut.validate({
      invalidField: [{ [field]: faker.random.word() }],
    });
    expect(error).toEqual(validationSpy.error);
  });

  test('Should return a MissingParamError if fieldNames validation fails', () => {
    const { sut, validationSpy } = makeSut();
    validationSpy.error = new MissingParamError(field);
    const error = sut.validate({
      [objectField]: [{ invalidField: faker.random.word() }],
    });
    expect(error).toEqual(validationSpy.error);
  });

  test('Should not return if validation succeds', () => {
    const { sut } = makeSut();
    const error = sut.validate({
      [objectField]: [{ [field]: faker.random.word() }],
    });
    expect(error).toBeNull();
  });
});
