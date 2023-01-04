import { LoadSurveyResult } from '@/domain/usecases/survey-result/load-survey-result';
import { SurveyResultModel } from '@/domain/models/survey-result';
import { LoadSurveyResultRepository } from '@/data/protocols/db/survey-result/load-survey-result-repository';

export class DbLoadSurveyResult implements LoadSurveyResult {
  constructor(
    private readonly loadSurveyResultRepository: LoadSurveyResultRepository
  ) {}

  async load(surveyId: string): Promise<SurveyResultModel | null> {
    await this.loadSurveyResultRepository.loadBySurveyId(surveyId);
    return null;
  }
}
