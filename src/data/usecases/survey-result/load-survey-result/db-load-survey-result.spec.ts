import { DbLoadSurveyResult } from './db-load-survey-result';
import { LoadSurveyResultRepository } from './db-load-survey-result-protocols';
import { mockLoadSurveyResultRepository } from '@/data/tests';
import { throwError } from '@/domain/tests';

type SutTypes = {
  sut: DbLoadSurveyResult;
  loadSurveyResultRepositoryStub: LoadSurveyResultRepository;
};

const makeSut = (): SutTypes => {
  const loadSurveyResultRepositoryStub = mockLoadSurveyResultRepository();
  const sut = new DbLoadSurveyResult(loadSurveyResultRepositoryStub);
  return { sut, loadSurveyResultRepositoryStub };
};

describe('DbLoadSurveyResult UseCase', () => {
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

  test("Should return null if LoadSurveyResultRepository isn't exists", async () => {
    const { loadSurveyResultRepositoryStub, sut } = makeSut();
    jest
      .spyOn(loadSurveyResultRepositoryStub, 'loadBySurveyId')
      .mockReturnValueOnce(Promise.resolve(null));
    const surveyResult = await sut.load('any_survey_id');
    expect(surveyResult).toBe(null);
  });
});
