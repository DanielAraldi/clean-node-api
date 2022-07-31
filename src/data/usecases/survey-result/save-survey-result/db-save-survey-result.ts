import {
  SaveSurveyResult,
  SaveSurveyResultModel,
  SurveyResultModel,
  SaveSurveyResultRepository,
} from "./db-save-survey-result-protocols";

export class DbSaveSurveyResult implements SaveSurveyResult {
  constructor(
    private readonly saveSurveyResultRepository: SaveSurveyResultRepository
  ) {}

  async save(data: SaveSurveyResultModel): Promise<SurveyResultModel> {
    return await this.saveSurveyResultRepository.save(data);
  }
}
