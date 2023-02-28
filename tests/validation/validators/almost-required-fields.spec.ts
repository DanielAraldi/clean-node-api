import { MissingParamError } from '@/presentation/errors';
import { AlmostRequiredFieldValidation } from '@/validation/validators';
import { faker } from '@faker-js/faker';

const firstField = faker.random.word();
const secondField = faker.random.word();

const makeSut = (): AlmostRequiredFieldValidation =>
  new AlmostRequiredFieldValidation([firstField, secondField]);

describe('Required Field Validation', () => {
  test('Should return a MissingParamError if no field is provided', () => {
    const sut = makeSut();
    const error = sut.validate({ invalidField: faker.random.word() });
    expect(error).toEqual(
      new MissingParamError([firstField, secondField].join(' or '))
    );
  });

  test('Should returns null if a field is provided', () => {
    const sut = makeSut();
    const error = sut.validate({ [firstField]: faker.random.word() });
    expect(error).toBeNull();
  });
});
