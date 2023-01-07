import { InvalidParamError } from '@/presentation/errors';
import { CompareFieldsValidation } from './compare-fields-validation';
import { faker } from '@faker-js/faker';

const field = faker.random.word();
const fieldToCompare = faker.random.word();

const makeSut = (): CompareFieldsValidation =>
  new CompareFieldsValidation(field, fieldToCompare);

describe('CompareFieldsValidation', () => {
  test('Should return an InvalidParamError if validation fails', () => {
    const sut = makeSut();
    const error = sut.validate({
      [field]: faker.random.word(),
      [fieldToCompare]: faker.random.word(),
    });
    expect(error).toEqual(new InvalidParamError(fieldToCompare));
  });

  test('Should not return if validation succeds', () => {
    const sut = makeSut();
    const value = faker.random.word();
    const error = sut.validate({
      [field]: value,
      [fieldToCompare]: value,
    });
    expect(error).toBeNull();
  });
});
