import { DbEditAccount } from '@/data/usecases';
import { mockEditAccountParams } from '@/tests/domain/mocks';
import { CheckAccountByEmailRepositorySpy } from '@/tests/data/mocks';

type SutTypes = {
  sut: DbEditAccount;
  checkAccountByEmailRepositorySpy: CheckAccountByEmailRepositorySpy;
};

const makeSut = (): SutTypes => {
  const checkAccountByEmailRepositorySpy =
    new CheckAccountByEmailRepositorySpy();
  const sut = new DbEditAccount(checkAccountByEmailRepositorySpy);
  return {
    sut,
    checkAccountByEmailRepositorySpy,
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
});
