import {
  LoadSurveys,
  LoadSurveysRepository,
  SurveyModel,
} from "./db-load-surveys-protocols";

export class DbLoadSurveys implements LoadSurveys {
  constructor(private readonly loadSurveysRespository: LoadSurveysRepository) {}

  async load(): Promise<SurveyModel[]> {
    return await this.loadSurveysRespository.loadAll();
  }
}
