import { LoadSurveyResult } from '@/domain/usecases/survey-result/load-survey-result';
import { SurveyResultModel } from '@/domain/models/survey-result';
import { LoadSurveyResultRepository } from './db-load-survey-result-protocols';

export class DbLoadSurveyResult implements LoadSurveyResult {
  constructor(
    private readonly loadSurveyResultRepository: LoadSurveyResultRepository
  ) {}

  async load(surveyId: string): Promise<SurveyResultModel | null> {
    return await this.loadSurveyResultRepository.loadBySurveyId(surveyId);
  }
}
