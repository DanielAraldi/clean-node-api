import { MissingParamError } from '@/presentation/errors';
import { RequiredFieldValidation } from '@/validation/validators';
import { faker } from '@faker-js/faker';

const field = faker.random.word();

const makeSut = (): RequiredFieldValidation =>
  new RequiredFieldValidation([field]);

describe('Required Field Validation', () => {
  test('Should return a MissingParamError if validation fails', () => {
    const sut = makeSut();
    const error = sut.validate({ invalidField: faker.random.word() });
    expect(error).toEqual(new MissingParamError(field));
  });

  test('Should not return if validation succeds', () => {
    const sut = makeSut();
    const error = sut.validate({ [field]: faker.random.word() });
    expect(error).toBeNull();
  });
});
