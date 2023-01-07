import { AddSurveyRepository } from '@/data/protocols/db/survey/add-survey-repository';
import { AddSurveyParams } from '@/domain/usecases/survey/add-survey';
import { LoadSurveyByIdRepository } from '@/data/protocols/db/survey/load-survey-by-id-repository';
import { LoadSurveysRepository } from '@/data/protocols/db/survey/load-surveys-repository';
import { SurveyModel } from '@/domain/models/survey';
import { mockSurveyModel, mockSurveysModels } from '@/domain/tests';

export class AddSurveyRepositorySpy implements AddSurveyRepository {
  addSurveyParams: AddSurveyParams;

  async add(data: AddSurveyParams): Promise<void> {
    this.addSurveyParams = data;
    return Promise.resolve();
  }
}

export class LoadSurveyByIdRepositorySpy implements LoadSurveyByIdRepository {
  surveyModel = mockSurveyModel();
  id: string;

  async loadById(id: string): Promise<SurveyModel> {
    this.id = id;
    return Promise.resolve(this.surveyModel);
  }
}

export class LoadSurveysRepositorySpy implements LoadSurveysRepository {
  surveyModels = mockSurveysModels();
  callsCount = 0;

  async loadAll(): Promise<SurveyModel[]> {
    this.callsCount++;
    return Promise.resolve(this.surveyModels);
  }
}
