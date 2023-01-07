import {
  LoadSurveys,
  LoadSurveysRepository,
  SurveyModel,
} from './db-load-surveys-protocols';

export class DbLoadSurveys implements LoadSurveys {
  constructor(private readonly loadSurveysRespository: LoadSurveysRepository) {}

  async load(accountId: string): Promise<SurveyModel[]> {
    return await this.loadSurveysRespository.loadAll(accountId);
  }
}
