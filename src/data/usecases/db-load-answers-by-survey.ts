import { LoadAnswersBySurvey } from '@/domain/usecases';
import { LoadSurveyByIdRepository } from '@/data/protocols';

export class DbLoadAnswersBySurvey implements LoadAnswersBySurvey {
  constructor(
    private readonly loadSurveyByIdRepository: LoadSurveyByIdRepository
  ) {}

  async loadAnswers(id: string): Promise<LoadAnswersBySurvey.Result> {
    const surveys = await this.loadSurveyByIdRepository.loadById(id);
    return surveys?.answers.map(answer => answer.answerId) || [];
  }
}
