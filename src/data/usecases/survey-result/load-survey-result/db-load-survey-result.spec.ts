import { LoadSurveyResultRepository } from '@/data/protocols/db/survey-result/load-survey-result-repository';
import { SurveyResultModel } from '@/domain/models/survey-result';
import { mockSaveSurveyResultModel } from '@/domain/tests';
import { DbLoadSurveyResult } from './db-load-survey-result';

describe('DbLoadSurveyResult UseCase', () => {
  test('Should call LoadSurveyResultRepository', async () => {
    class LoadSurveyResultRepositoryStub implements LoadSurveyResultRepository {
      async loadBySurveyId(surveyId: string): Promise<SurveyResultModel> {
        return Promise.resolve(mockSaveSurveyResultModel());
      }
    }
    const loadSurveyResultRepositoryStub = new LoadSurveyResultRepositoryStub();
    const sut = new DbLoadSurveyResult(loadSurveyResultRepositoryStub);
    const loadBySurveyIdSpy = jest.spyOn(
      loadSurveyResultRepositoryStub,
      'loadBySurveyId'
    );
    await sut.load('any_survey_id');
    expect(loadBySurveyIdSpy).toHaveBeenCalledWith('any_survey_id');
  });
});
