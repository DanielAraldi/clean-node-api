import {
  AddSurvey,
  LoadSurveys,
  LoadSurveyById,
  CheckSurveyById,
} from '@/domain/usecases';
import { SurveyModel } from '@/domain/models';
import { mockSurveyModel, mockSurveysModels } from '@/../tests/domain/mocks';

export class AddSurveySpy implements AddSurvey {
  addSurveyParams: AddSurvey.Params;

  async add(data: AddSurvey.Params): Promise<void> {
    this.addSurveyParams = data;
    return Promise.resolve();
  }
}

export class LoadSurveysSpy implements LoadSurveys {
  surveyModels = mockSurveysModels();
  accountId: string;

  async load(accountId: string): Promise<SurveyModel[]> {
    this.accountId = accountId;
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

export class CheckSurveyByIdSpy implements CheckSurveyById {
  result = true;
  id: string;

  async checkById(id: string): Promise<CheckSurveyById.Result> {
    this.id = id;
    return Promise.resolve(this.result);
  }
}
