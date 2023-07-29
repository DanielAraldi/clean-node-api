import { LoadAccountController } from '@/presentation/controllers';
import { LoadAccountSpy } from '@/tests/presentation/mocks';
import MockDate from 'mockdate';
import { faker } from '@faker-js/faker';

const mockRequest = (): LoadAccountController.Request => ({
  accountId: faker.datatype.uuid(),
});

type SutTypes = {
  sut: LoadAccountController;
  loadAccountSpy: LoadAccountSpy;
};

const makeSut = (): SutTypes => {
  const loadAccountSpy = new LoadAccountSpy();
  const sut = new LoadAccountController(loadAccountSpy);
  return { sut, loadAccountSpy };
};

describe('LoadAccount Controller', () => {
  beforeAll(() => {
    MockDate.set(new Date());
  });

  afterAll(() => {
    MockDate.reset();
  });

  test('Should call LoadAccount with correct value', async () => {
    const { sut, loadAccountSpy } = makeSut();
    const request = mockRequest();
    await sut.handle(request);
    expect(loadAccountSpy.accountId).toBe(request.accountId);
  });
});
