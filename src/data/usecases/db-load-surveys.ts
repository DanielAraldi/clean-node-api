import { LoadSurveys } from '@/domain/usecases';
import { LoadSurveysRepository } from '@/data/protocols';

export class DbLoadSurveys implements LoadSurveys {
  constructor(private readonly loadSurveysRespository: LoadSurveysRepository) {}

  async load(accountId: string): Promise<LoadSurveys.Result> {
    return await this.loadSurveysRespository.loadAll(accountId);
  }
}
