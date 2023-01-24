import { SaveSurveyResult, LoadSurveyResult } from '@/domain/usecases';
import { mockSaveSurveyResultModel } from '@/../tests/domain/mocks';

export class SaveSurveyResultSpy implements SaveSurveyResult {
  result = mockSaveSurveyResultModel();
  saveSurveyResultParams: SaveSurveyResult.Params;

  async save(data: SaveSurveyResult.Params): Promise<SaveSurveyResult.Result> {
    this.saveSurveyResultParams = data;
    return Promise.resolve(this.result);
  }
}

export class LoadSurveyResultSpy implements LoadSurveyResult {
  result = mockSaveSurveyResultModel();
  surveyId: string;
  accountId: string;

  async load(
    surveyId: string,
    accountId: string
  ): Promise<LoadSurveyResult.Result> {
    this.surveyId = surveyId;
    this.accountId = accountId;
    return Promise.resolve(this.result);
  }
}
