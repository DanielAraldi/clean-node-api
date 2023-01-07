import {
  SaveSurveyResult,
  SaveSurveyResultParams,
} from '@/domain/usecases/survey-result/save-survey-result';
import { LoadSurveyResult } from '@/domain/usecases/survey-result/load-survey-result';
import { SurveyResultModel } from '@/domain/models/survey-result';
import { mockSaveSurveyResultModel } from '@/domain/tests';

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

  async load(surveyId: string): Promise<SurveyResultModel> {
    this.surveyId = surveyId;
    return Promise.resolve(this.surveyResultModel);
  }
}
