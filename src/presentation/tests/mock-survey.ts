import {
  AddSurvey,
  AddSurveyParams,
} from '@/domain/usecases/survey/add-survey';
import { LoadSurveyById } from '@/domain/usecases/survey/load-survey-by-id';
import { SurveyModel } from '@/domain/models/survey';
import { LoadSurveys } from '@/domain/usecases/survey/load-surveys';
import { mockSurveyModel, mockSurveysModels } from '@/domain/tests';

export class AddSurveySpy implements AddSurvey {
  addSurveyParams: AddSurveyParams;

  async add(data: AddSurveyParams): Promise<void> {
    this.addSurveyParams = data;
    return Promise.resolve();
  }
}

export class LoadSurveysSpy implements LoadSurveys {
  surveyModels = mockSurveysModels();
  callsCount = 0;

  async load(): Promise<SurveyModel[]> {
    this.callsCount++;
    return Promise.resolve(this.surveyModels);
  }
}

export class LoadSurveyByIdSpy implements LoadSurveyById {
  surveyModel = mockSurveyModel();
  id: string;

  async loadById(id: string): Promise<SurveyModel> {
    this.id = id;
    return Promise.resolve(this.surveyModel);
  }
}
