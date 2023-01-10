import { DbSaveSurveyResult } from './db-save-survey-result';
import { throwError, mockSaveSurveyResultParams } from '@/domain/tests';
import {
  LoadSurveyResultRepositorySpy,
  SaveSurveyResultRepositorySpy,
} from '@/data/tests';
import MockDate from 'mockdate';

type SutTypes = {
  sut: DbSaveSurveyResult;
  saveSurveyResultRepositorySpy: SaveSurveyResultRepositorySpy;
  loadSurveyResultRepositorySpy: LoadSurveyResultRepositorySpy;
};

const makeSut = (): SutTypes => {
  const loadSurveyResultRepositorySpy = new LoadSurveyResultRepositorySpy();
  const saveSurveyResultRepositorySpy = new SaveSurveyResultRepositorySpy();
  const sut = new DbSaveSurveyResult(
    saveSurveyResultRepositorySpy,
    loadSurveyResultRepositorySpy
  );
  return {
    sut,
    saveSurveyResultRepositorySpy,
    loadSurveyResultRepositorySpy,
  };
};

describe('DbSaveSurveyResult Usecase', () => {
  beforeAll(() => MockDate.set(new Date()));

  afterAll(() => MockDate.reset());

  test('Should call SaveSurveyResultRepository with correct values', async () => {
    const { sut, saveSurveyResultRepositorySpy } = makeSut();
    const surveyResultData = mockSaveSurveyResultParams();
    await sut.save(surveyResultData);
    expect(saveSurveyResultRepositorySpy.saveSurveyResultParams).toEqual(
      surveyResultData
    );
  });

  test('Should throw if SaveSurveyResultRepository throws', async () => {
    const { sut, saveSurveyResultRepositorySpy } = makeSut();
    jest
      .spyOn(saveSurveyResultRepositorySpy, 'save')
      .mockImplementationOnce(throwError);
    const promise = sut.save(mockSaveSurveyResultParams());
    await expect(promise).rejects.toThrow();
  });

  test('Should call LoadSurveyResultRepository with correct values', async () => {
    const { loadSurveyResultRepositorySpy, sut } = makeSut();
    const surveyResultData = mockSaveSurveyResultParams();
    await sut.save(surveyResultData);
    expect(loadSurveyResultRepositorySpy.surveyId).toBe(
      surveyResultData.surveyId
    );
  });

  test("Should return null if LoadSurveyResultRepository don't have any survey result", async () => {
    const { loadSurveyResultRepositorySpy, sut } = makeSut();
    jest
      .spyOn(loadSurveyResultRepositorySpy, 'loadBySurveyId')
      .mockReturnValueOnce(Promise.resolve(null));
    const surveyResult = await sut.save(mockSaveSurveyResultParams());
    expect(surveyResult).toBeNull();
  });

  test('Should throw if LoadSurveyResultRepository throws', async () => {
    const { loadSurveyResultRepositorySpy, sut } = makeSut();
    jest
      .spyOn(loadSurveyResultRepositorySpy, 'loadBySurveyId')
      .mockImplementationOnce(throwError);
    const promise = sut.save(mockSaveSurveyResultParams());
    await expect(promise).rejects.toThrow();
  });

  test('Should return SurveyResult on success', async () => {
    const { sut, loadSurveyResultRepositorySpy } = makeSut();
    const surveyResult = await sut.save(mockSaveSurveyResultParams());
    expect(surveyResult).toEqual(
      loadSurveyResultRepositorySpy.surveyResultModel
    );
  });
});
