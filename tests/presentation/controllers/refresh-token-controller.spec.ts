import { RefreshTokenController } from '@/presentation/controllers';
import { mockRefreshTokenParams } from '@/tests/domain/mocks';
import { ValidationSpy } from '@/tests/presentation/mocks';
import { MissingParamError } from '@/presentation/errors';
import { badRequest } from '@/presentation/helpers';
import { faker } from '@faker-js/faker';

type SutTypes = {
  validationSpy: ValidationSpy;
  sut: RefreshTokenController;
};

const mockRequest = (): RefreshTokenController.Request =>
  mockRefreshTokenParams();

const makeSut = (): SutTypes => {
  const validationSpy = new ValidationSpy();
  const sut = new RefreshTokenController(validationSpy);
  return { sut, validationSpy };
};

describe('Refresh Token Controller', () => {
  test('Should call Validation with correct value', async () => {
    const { sut, validationSpy } = makeSut();
    const request = mockRequest();
    await sut.handle(request);
    expect(validationSpy.input).toEqual(request);
  });

  test('Should return 400 if Validation returns an error', async () => {
    const { sut, validationSpy } = makeSut();
    validationSpy.error = new MissingParamError(faker.random.word());
    const httpResponse = await sut.handle(mockRequest());
    expect(httpResponse).toEqual(badRequest(validationSpy.error));
  });
});
