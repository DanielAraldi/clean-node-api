import { LoginController } from '@/presentation/controllers';
import { HttpResponse } from '@/presentation/protocols';
import {
  badRequest,
  serverError,
  unauthorized,
  ok,
} from '@/presentation/helpers';
import { MissingParamError } from '@/presentation/errors';
import {
  AuthenticationSpy,
  ValidationSpy,
} from '@/../tests/presentation/mocks';
import { throwError, mockAuthenticationParams } from '@/../tests/domain/mocks';
import { faker } from '@faker-js/faker';

const mockRequest = (): LoginController.Request => mockAuthenticationParams();

type SutTypes = {
  sut: LoginController;
  authenticationSpy: AuthenticationSpy;
  validationSpy: ValidationSpy;
};

const makeSut = (): SutTypes => {
  const authenticationSpy = new AuthenticationSpy();
  const validationSpy = new ValidationSpy();
  const sut = new LoginController(authenticationSpy, validationSpy);
  return { sut, authenticationSpy, validationSpy };
};

describe('Login Controller', () => {
  test('Should call Authentication with correct values', async () => {
    const { sut, authenticationSpy } = makeSut();
    const request = mockRequest();
    await sut.handle(request);
    expect(authenticationSpy.authenticationParams).toEqual({
      email: request.email,
      password: request.password,
    });
  });

  test('Should return 401 if invalid credentials are provided', async () => {
    const { sut, authenticationSpy } = makeSut();
    authenticationSpy.result = null;
    const httpResponse: HttpResponse = await sut.handle(mockRequest());
    expect(httpResponse).toEqual(unauthorized());
  });

  test('Should returns 500 if Authentication throws', async () => {
    const { sut, authenticationSpy } = makeSut();
    jest.spyOn(authenticationSpy, 'auth').mockImplementationOnce(throwError);
    const httpResponse: HttpResponse = await sut.handle(mockRequest());
    expect(httpResponse).toEqual(serverError(new Error()));
  });

  test('Should return 200 if valid credentials are provided', async () => {
    const { sut, authenticationSpy } = makeSut();
    const httpResponse = await sut.handle(mockRequest());
    expect(httpResponse).toEqual(ok(authenticationSpy.result));
  });

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
