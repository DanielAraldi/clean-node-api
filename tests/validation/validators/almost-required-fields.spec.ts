import { MissingParamError } from '@/presentation/errors';
import { AlmostRequiredFieldValidation } from '@/validation/validators';
import { faker } from '@faker-js/faker';

const firstField = faker.random.word();
const secondField = faker.random.word();

const makeSut = (extraFieldNames?: string[]): AlmostRequiredFieldValidation =>
  new AlmostRequiredFieldValidation(
    extraFieldNames || [firstField, secondField]
  );

describe('Required Field Validation', () => {
  test('Should return a MissingParamError if no field is provided', () => {
    const sut = makeSut();
    const error = sut.validate({ invalidField: faker.random.word() });
    expect(error).toEqual(
      new MissingParamError([firstField, secondField].join(' or '))
    );
  });

  test("Should return a MissingParamError no 'or' in message error if field isn't provided", () => {
    const sut = makeSut([firstField]);
    const error = sut.validate({ invalidField: faker.random.word() });
    expect(error).toEqual(new MissingParamError(firstField));
  });

  test('Should returns null if a field is provided', () => {
    const sut = makeSut();
    const error = sut.validate({ [firstField]: faker.random.word() });
    expect(error).toBeNull();
  });

  test('Should returns null if all fields is provided', () => {
    const sut = makeSut();
    const error = sut.validate({
      [firstField]: faker.random.word(),
      [secondField]: faker.random.word(),
    });
    expect(error).toBeNull();
  });
});
