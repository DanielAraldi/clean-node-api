import { RefreshTokenController } from '@/presentation/controllers';
import { mockRefreshTokenParams } from '@/tests/domain/mocks';
import { RefreshTokenSpy, ValidationSpy } from '@/tests/presentation/mocks';
import { MissingParamError } from '@/presentation/errors';
import { badRequest } from '@/presentation/helpers';
import { faker } from '@faker-js/faker';

type SutTypes = {
  validationSpy: ValidationSpy;
  refreshTokenSpy: RefreshTokenSpy;
  sut: RefreshTokenController;
};

const mockRequest = (): RefreshTokenController.Request =>
  mockRefreshTokenParams();

const makeSut = (): SutTypes => {
  const validationSpy = new ValidationSpy();
  const refreshTokenSpy = new RefreshTokenSpy();
  const sut = new RefreshTokenController(validationSpy, refreshTokenSpy);
  return { sut, validationSpy, refreshTokenSpy };
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

  test('Should call RefreshToken with correct values', async () => {
    const { sut, refreshTokenSpy } = makeSut();
    const request = mockRequest();
    await sut.handle(request);
    expect(refreshTokenSpy.accessToken).toBe(request.accessToken);
  });
});
