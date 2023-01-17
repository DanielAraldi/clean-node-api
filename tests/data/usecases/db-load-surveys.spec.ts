import { DbLoadSurveys } from '@/data/usecases';
import { throwError } from '@/../tests/domain/mocks';
import { LoadSurveysRepositorySpy } from '@/../tests/data/mocks';
import MockDate from 'mockdate';
import { faker } from '@faker-js/faker';

type SutTypes = {
  sut: DbLoadSurveys;
  loadSurveysRepositorySpy: LoadSurveysRepositorySpy;
};

const makeSut = (): SutTypes => {
  const loadSurveysRepositorySpy = new LoadSurveysRepositorySpy();
  const sut = new DbLoadSurveys(loadSurveysRepositorySpy);
  return {
    sut,
    loadSurveysRepositorySpy,
  };
};

let accountId: string;

describe('DbLoadSurveys Usecase', () => {
  beforeAll(() => {
    MockDate.set(new Date());
  });

  afterAll(() => {
    MockDate.reset();
  });

  beforeEach(() => {
    accountId = faker.datatype.uuid();
  });

  test('Should call LoadSurveysRepository', async () => {
    const { sut, loadSurveysRepositorySpy } = makeSut();
    await sut.load(accountId);
    expect(loadSurveysRepositorySpy.accountId).toBe(accountId);
  });

  test('Should return a list of survey on success', async () => {
    const { sut, loadSurveysRepositorySpy } = makeSut();
    const surveys = await sut.load(accountId);
    expect(surveys).toEqual(loadSurveysRepositorySpy.surveyModels);
  });

  test('Should throw if LoadSurveysRepository throws', async () => {
    const { sut, loadSurveysRepositorySpy } = makeSut();
    jest
      .spyOn(loadSurveysRepositorySpy, 'loadAll')
      .mockImplementationOnce(throwError);
    const promise = sut.load(accountId);
    await expect(promise).rejects.toThrow();
  });
});
