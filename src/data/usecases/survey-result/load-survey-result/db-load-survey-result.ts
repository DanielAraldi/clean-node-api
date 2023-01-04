import { LoadSurveyResult } from '@/domain/usecases/survey-result/load-survey-result';
import {
  LoadSurveyResultRepository,
  SurveyResultModel,
} from './db-load-survey-result-protocols';

export class DbLoadSurveyResult implements LoadSurveyResult {
  constructor(
    private readonly loadSurveyResultRepository: LoadSurveyResultRepository
  ) {}

  async load(surveyId: string): Promise<SurveyResultModel | null> {
    await this.loadSurveyResultRepository.loadBySurveyId(surveyId);
    return null;
  }
}
