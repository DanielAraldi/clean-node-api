import { DbLoadSurveyResult } from './db-load-survey-result';
import {
  LoadSurveyResultRepository,
  LoadSurveyByIdRepository,
} from './db-load-survey-result-protocols';
import {
  mockLoadSurveyByIdRepository,
  mockLoadSurveyResultRepository,
} from '@/data/tests';
import { mockSaveSurveyResultModel, throwError } from '@/domain/tests';
import MockDate from 'mockdate';

type SutTypes = {
  sut: DbLoadSurveyResult;
  loadSurveyResultRepositoryStub: LoadSurveyResultRepository;
  loadSurveyByIdRepositoryStub: LoadSurveyByIdRepository;
};

const makeSut = (): SutTypes => {
  const loadSurveyByIdRepositoryStub = mockLoadSurveyByIdRepository();
  const loadSurveyResultRepositoryStub = mockLoadSurveyResultRepository();
  const sut = new DbLoadSurveyResult(
    loadSurveyResultRepositoryStub,
    loadSurveyByIdRepositoryStub
  );
  return { sut, loadSurveyResultRepositoryStub, loadSurveyByIdRepositoryStub };
};

describe('DbLoadSurveyResult UseCase', () => {
  beforeAll(() => MockDate.set(new Date()));

  afterAll(() => MockDate.reset());

  test('Should call LoadSurveyResultRepository', async () => {
    const { loadSurveyResultRepositoryStub, sut } = makeSut();
    const loadBySurveyIdSpy = jest.spyOn(
      loadSurveyResultRepositoryStub,
      'loadBySurveyId'
    );
    await sut.load('any_survey_id');
    expect(loadBySurveyIdSpy).toHaveBeenCalledWith('any_survey_id');
  });

  test('Should throw if LoadSurveyResultRepository throws', async () => {
    const { loadSurveyResultRepositoryStub, sut } = makeSut();
    jest
      .spyOn(loadSurveyResultRepositoryStub, 'loadBySurveyId')
      .mockImplementationOnce(throwError);
    const promise = sut.load('any_survey_id');
    await expect(promise).rejects.toThrow();
  });

  test('Should call LoadSurveyByIdRepository if LoadSurveyResultRepository returns null', async () => {
    const {
      sut,
      loadSurveyResultRepositoryStub,
      loadSurveyByIdRepositoryStub,
    } = makeSut();
    const loadByIdSpy = jest.spyOn(loadSurveyByIdRepositoryStub, 'loadById');
    jest
      .spyOn(loadSurveyResultRepositoryStub, 'loadBySurveyId')
      .mockReturnValueOnce(Promise.resolve(null));
    await sut.load('any_survey_id');
    expect(loadByIdSpy).toHaveBeenCalledWith('any_survey_id');
  });

  test("Should return null if LoadSurveyByIdRepository isn't exists", async () => {
    const {
      loadSurveyByIdRepositoryStub,
      loadSurveyResultRepositoryStub,
      sut,
    } = makeSut();
    jest
      .spyOn(loadSurveyResultRepositoryStub, 'loadBySurveyId')
      .mockReturnValueOnce(Promise.resolve(null));
    jest
      .spyOn(loadSurveyByIdRepositoryStub, 'loadById')
      .mockReturnValueOnce(Promise.resolve(null));
    const surveyResult = await sut.load('any_survey_id');
    expect(surveyResult).toBeNull();
  });

  test('Should return surveyResultModel with all answers with count and percent zero if LoadSurveyResultRepository returns null', async () => {
    const { sut, loadSurveyResultRepositoryStub } = makeSut();
    jest
      .spyOn(loadSurveyResultRepositoryStub, 'loadBySurveyId')
      .mockReturnValueOnce(Promise.resolve(null));
    const surveyResult = await sut.load('any_survey_id');
    expect(surveyResult).toEqual(mockSaveSurveyResultModel());
  });

  test('Should return surveyResultModel on success', async () => {
    const { sut } = makeSut();
    const surveyResult = await sut.load('any_survey_id');
    expect(surveyResult).toEqual(mockSaveSurveyResultModel());
  });
});
