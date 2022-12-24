import {
  SaveSurveyResult,
  SaveSurveyResultParams,
} from '@/domain/usecases/survey-result/save-survey-result';
import { SurveyResultModel } from '@/domain/models/survey-result';
import { mockSaveSurveyResultModel } from '@/domain/tests';

export const mockSaveSurveyResult = (): SaveSurveyResult => {
  class SaveSurveyResultStub implements SaveSurveyResult {
    async save(data: SaveSurveyResultParams): Promise<SurveyResultModel> {
      return Promise.resolve(mockSaveSurveyResultModel());
    }
  }
  return new SaveSurveyResultStub();
};
