import { EditAccountController } from '@/presentation/controllers';
import { throwError } from '@/tests/domain/mocks';
import { EditAccountSpy, ValidationSpy } from '@/tests/presentation/mocks';
import { EmailInUseError, MissingParamError } from '@/presentation/errors';
import {
  badRequest,
  forbidden,
  noContent,
  serverError,
} from '@/presentation/helpers';
import MockDate from 'mockdate';
import { faker } from '@faker-js/faker';

const mockRequest = (): EditAccountController.Request => ({
  accountId: faker.datatype.uuid(),
  name: faker.name.fullName(),
  email: faker.internet.email(),
});

type SutTypes = {
  sut: EditAccountController;
  editAccountSpy: EditAccountSpy;
  validationSpy: ValidationSpy;
};

const makeSut = (): SutTypes => {
  const validationSpy = new ValidationSpy();
  const editAccountSpy = new EditAccountSpy();
  const sut = new EditAccountController(validationSpy, editAccountSpy);
  return {
    sut,
    editAccountSpy,
    validationSpy,
  };
};

describe('EditAccount Controller', () => {
  beforeAll(() => {
    MockDate.set(new Date());
  });

  afterAll(() => {
    MockDate.reset();
  });

  test('Should return 500 if EditAccount throws', async () => {
    const { sut, editAccountSpy } = makeSut();
    jest.spyOn(editAccountSpy, 'edit').mockImplementationOnce(throwError);
    const httpResponse = await sut.handle(mockRequest());
    expect(httpResponse).toEqual(serverError(new Error()));
  });

  test('Should call EditAccount with correct values', async () => {
    const { sut, editAccountSpy } = makeSut();
    const request = mockRequest();
    await sut.handle(request);
    expect(editAccountSpy.editAccountParams).toEqual({
      name: request.name,
      email: request.email,
      accountId: request.accountId,
      updatedAt: editAccountSpy.editAccountParams.updatedAt,
    });
  });

  test('Should return 403 if EditAccount returns false', async () => {
    const { sut, editAccountSpy } = makeSut();
    editAccountSpy.result = false;
    const httpResponse = await sut.handle(mockRequest());
    expect(httpResponse).toEqual(forbidden(new EmailInUseError()));
  });

  test('Should call Validation with correct values', async () => {
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

  test('Should return 204 no success', async () => {
    const { sut } = makeSut();
    const httpResponse = await sut.handle(mockRequest());
    expect(httpResponse).toEqual(noContent());
  });
});
