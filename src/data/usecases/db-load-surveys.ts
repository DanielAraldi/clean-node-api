import { LoadSurveys } from '@/domain/usecases';
import { SurveyModel } from '@/domain/models';
import { LoadSurveysRepository } from '@/data/protocols';

export class DbLoadSurveys implements LoadSurveys {
  constructor(private readonly loadSurveysRespository: LoadSurveysRepository) {}

  async load(accountId: string): Promise<SurveyModel[]> {
    return await this.loadSurveysRespository.loadAll(accountId);
  }
}
