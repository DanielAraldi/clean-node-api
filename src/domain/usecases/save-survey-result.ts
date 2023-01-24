import { SurveyResultModel } from '@/domain/models';

export interface SaveSurveyResult {
  save(data: SaveSurveyResult.Params): Promise<SaveSurveyResult.Result>;
}

export namespace SaveSurveyResult {
  export type Params = {
    surveyId: string;
    accountId: string;
    answerId: string;
    date: Date;
  };
  export type Result = SurveyResultModel | null;
}
