import { InvalidLengthError } from '@/presentation/errors';
import { LengthFieldValidation } from '@/validation/validators';
import { faker } from '@faker-js/faker';

const field = faker.random.word();

const makeSut = (): LengthFieldValidation =>
  new LengthFieldValidation(field, 2);

describe('Length Field Validation', () => {
  test('Should return an InvalidLengthError if validation fails', () => {
    const sut = makeSut();
    const error = sut.validate({ [field]: [] });
    expect(error).toEqual(new InvalidLengthError(field));
  });

  test('Should not return if validation succeds with minimum length', () => {
    const sut = makeSut();
    const error = sut.validate({
      [field]: [faker.random.word(), faker.random.word()],
    });
    expect(error).toBeNull();
  });
});
