import { EditAccountController } from '@/presentation/controllers';
import { throwError } from '@/tests/domain/mocks';
import { EditAccountSpy, ValidationSpy } from '@/tests/presentation/mocks';
import { EmailInUseError, ServerError } from '@/presentation/errors';
import { forbidden, serverError } from '@/presentation/helpers';
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
  test('Should return 500 if EditAccount throws', async () => {
    const { sut, editAccountSpy } = makeSut();
    jest.spyOn(editAccountSpy, 'edit').mockImplementationOnce(throwError);
    const httpResponse = await sut.handle(mockRequest());
    expect(httpResponse).toEqual(serverError(new ServerError(null)));
  });

  test('Should call EditAccount with correct values', async () => {
    const { sut, editAccountSpy } = makeSut();
    const request = mockRequest();
    await sut.handle(request);
    expect(editAccountSpy.editAccountParams).toEqual({
      name: request.name,
      email: request.email,
      accountId: request.accountId,
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
});
