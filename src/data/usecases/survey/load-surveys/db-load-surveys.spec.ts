import { LoadSurveysRepository } from './db-load-surveys-protocols';
import { DbLoadSurveys } from './db-load-surveys';
import { mockSurveysModels, throwError } from '@/domain/tests';
import { LoadSurveysRepositorySpy } from '@/data/tests';
import MockDate from 'mockdate';

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

describe('DbLoadSurveys Usecase', () => {
  beforeAll(() => MockDate.set(new Date()));

  afterAll(() => MockDate.reset());

  test('Should call LoadSurveysRepository', async () => {
    const { sut, loadSurveysRepositorySpy } = makeSut();
    await sut.load();
    expect(loadSurveysRepositorySpy.callsCount).toBe(1);
  });

  test('Should return a list of survey on success', async () => {
    const { sut, loadSurveysRepositorySpy } = makeSut();
    const surveys = await sut.load();
    expect(surveys).toEqual(loadSurveysRepositorySpy.surveyModels);
  });

  test('Should throw if LoadSurveysRepository throws', async () => {
    const { sut, loadSurveysRepositorySpy } = makeSut();
    jest
      .spyOn(loadSurveysRepositorySpy, 'loadAll')
      .mockImplementationOnce(throwError);
    const promise = sut.load();
    await expect(promise).rejects.toThrow();
  });
});
