import { LoadSurveyResult } from '@/domain/usecases/survey-result/load-survey-result';
import { SurveyResultModel } from '@/domain/models/survey-result';
import {
  LoadSurveyByIdRepository,
  LoadSurveyResultRepository,
} from './db-load-survey-result-protocols';

export class DbLoadSurveyResult implements LoadSurveyResult {
  constructor(
    private readonly loadSurveyResultRepository: LoadSurveyResultRepository,
    private readonly loadSurveyByIdRepository: LoadSurveyByIdRepository
  ) {}

  async load(surveyId: string): Promise<SurveyResultModel | null> {
    let surveyResult = await this.loadSurveyResultRepository.loadBySurveyId(
      surveyId
    );

    if (!surveyResult) {
      const survey = await this.loadSurveyByIdRepository.loadById(surveyId);
      if (!survey) return null;

      surveyResult = {
        surveyId: survey.id,
        question: survey.question,
        date: survey.date,
        answers: survey.answers.map(answer =>
          Object.assign({}, answer, {
            count: 0,
            percent: 0,
          })
        ),
      };
    }
    return surveyResult;
  }
}
