import { RefreshTokenController } from '@/presentation/controllers';
import { mockRefreshTokenParams, throwError } from '@/tests/domain/mocks';
import { RefreshTokenSpy, ValidationSpy } from '@/tests/presentation/mocks';
import { MissingParamError } from '@/presentation/errors';
import {
  badRequest,
  ok,
  serverError,
  unauthorized,
} from '@/presentation/helpers';
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

  test('Should return 401 if invalid credentials are provided', async () => {
    const { sut, refreshTokenSpy } = makeSut();
    refreshTokenSpy.result = null;
    const httpResponse = await sut.handle(mockRequest());
    expect(httpResponse).toEqual(unauthorized());
  });

  test('Should return 500 if RefreshToken throws', async () => {
    const { sut, refreshTokenSpy } = makeSut();
    jest.spyOn(refreshTokenSpy, 'refresh').mockImplementationOnce(throwError);
    const httpResponse = await sut.handle(mockRequest());
    expect(httpResponse).toEqual(serverError(new Error()));
  });

  test('Should return 200 if valid credentials are provided', async () => {
    const { sut, refreshTokenSpy } = makeSut();
    const httpResponse = await sut.handle(mockRequest());
    expect(httpResponse).toEqual(ok(refreshTokenSpy.result));
  });
});
