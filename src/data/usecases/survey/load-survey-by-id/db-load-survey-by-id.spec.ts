import { DbLoadSurveyById } from './db-load-survey-by-id';
import { mockSurveyModel, throwError } from '@/domain/tests';
import { LoadSurveyByIdRepositorySpy } from '@/data/tests';
import MockDate from 'mockdate';
import { faker } from '@faker-js/faker';

type SutTypes = {
  sut: DbLoadSurveyById;
  loadSurveyByIdRepositorySpy: LoadSurveyByIdRepositorySpy;
};

const makeSut = (): SutTypes => {
  const loadSurveyByIdRepositorySpy = new LoadSurveyByIdRepositorySpy();
  const sut = new DbLoadSurveyById(loadSurveyByIdRepositorySpy);
  return {
    sut,
    loadSurveyByIdRepositorySpy,
  };
};

let surveyId: string;

describe('DbLoadSurveyById Usecase', () => {
  beforeAll(() => { MockDate.set(new Date()); });

  afterAll(() => { MockDate.reset(); });

  beforeEach(() => {
    surveyId = faker.datatype.uuid();
  });

  test('Should call LoadSurveyByIdRepository', async () => {
    const { sut, loadSurveyByIdRepositorySpy } = makeSut();
    await sut.loadById(surveyId);
    expect(loadSurveyByIdRepositorySpy.id).toBe(surveyId);
  });

  test('Should throw if LoadSurveyByIdRepository throws', async () => {
    const { sut, loadSurveyByIdRepositorySpy } = makeSut();
    jest
      .spyOn(loadSurveyByIdRepositorySpy, 'loadById')
      .mockImplementationOnce(throwError);
    const promise = sut.loadById(surveyId);
    await expect(promise).rejects.toThrow();
  });

  test('Should return Survey on success', async () => {
    const { sut, loadSurveyByIdRepositorySpy } = makeSut();
    const survey = await sut.loadById(surveyId);
    expect(survey).toEqual(loadSurveyByIdRepositorySpy.surveyModel);
  });
});
