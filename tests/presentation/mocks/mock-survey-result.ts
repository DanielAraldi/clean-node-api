import {
  SaveSurveyResult,
  SaveSurveyResultParams,
  LoadSurveyResult,
} from '@/domain/usecases';
import { SurveyResultModel } from '@/domain/models';
import { mockSaveSurveyResultModel } from '@/../tests/domain/mocks';

export class SaveSurveyResultSpy implements SaveSurveyResult {
  surveyResultModel = mockSaveSurveyResultModel();
  saveSurveyResultParams: SaveSurveyResultParams;

  async save(data: SaveSurveyResultParams): Promise<SurveyResultModel> {
    this.saveSurveyResultParams = data;
    return Promise.resolve(this.surveyResultModel);
  }
}

export class LoadSurveyResultSpy implements LoadSurveyResult {
  surveyResultModel = mockSaveSurveyResultModel();
  surveyId: string;
  accountId: string;

  async load(surveyId: string, accountId: string): Promise<SurveyResultModel> {
    this.surveyId = surveyId;
    this.accountId = accountId;
    return Promise.resolve(this.surveyResultModel);
  }
}
