import { DbEditAccount } from '@/data/usecases';
import { mockEditAccountParams, throwError } from '@/tests/domain/mocks';
import {
  CheckAccountByEmailRepositorySpy,
  EditAccountRepositorySpy,
} from '@/tests/data/mocks';

type SutTypes = {
  sut: DbEditAccount;
  checkAccountByEmailRepositorySpy: CheckAccountByEmailRepositorySpy;
  editAccountRepositorySpy: EditAccountRepositorySpy;
};

const makeSut = (): SutTypes => {
  const checkAccountByEmailRepositorySpy =
    new CheckAccountByEmailRepositorySpy();
  const editAccountRepositorySpy = new EditAccountRepositorySpy();
  const sut = new DbEditAccount(
    editAccountRepositorySpy,
    checkAccountByEmailRepositorySpy
  );
  return {
    sut,
    checkAccountByEmailRepositorySpy,
    editAccountRepositorySpy,
  };
};

describe('DbEditAccount Usecase', () => {
  test('Should call CheckAccountByEmailRepository with correct email', async () => {
    const { sut, checkAccountByEmailRepositorySpy } = makeSut();
    const editAccountParams = mockEditAccountParams();
    await sut.edit(editAccountParams);
    expect(checkAccountByEmailRepositorySpy.email).toBe(
      editAccountParams.email
    );
  });

  test('Should return false if CheckAccountByEmailRepository returns true', async () => {
    const { sut, checkAccountByEmailRepositorySpy } = makeSut();
    checkAccountByEmailRepositorySpy.result = true;
    const isValid = await sut.edit(mockEditAccountParams());
    expect(isValid).toBe(false);
  });

  test('Should throw if CheckAccountByEmailRepository throws', async () => {
    const { sut, checkAccountByEmailRepositorySpy } = makeSut();
    jest
      .spyOn(checkAccountByEmailRepositorySpy, 'checkByEmail')
      .mockImplementationOnce(throwError);
    const editAccountParams = mockEditAccountParams();
    const promise = sut.edit(editAccountParams);
    await expect(promise).rejects.toThrow();
  });

  test('Should call EditAccountRepository with correct values', async () => {
    const { sut, editAccountRepositorySpy } = makeSut();
    const editAccountParams = mockEditAccountParams();
    await sut.edit(editAccountParams);
    expect(editAccountRepositorySpy.editAccountParams).toEqual(
      editAccountParams
    );
  });

  test('Should throw if EditAccountRepository throws', async () => {
    const { sut, editAccountRepositorySpy } = makeSut();
    jest
      .spyOn(editAccountRepositorySpy, 'edit')
      .mockImplementationOnce(throwError);
    const editAccountParams = mockEditAccountParams();
    const promise = sut.edit(editAccountParams);
    await expect(promise).rejects.toThrow();
  });
});
