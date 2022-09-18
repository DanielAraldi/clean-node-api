import {
  AddSurvey,
  AddSurveyParams,
} from "@/domain/usecases/survey/add-survey";
import { LoadSurveyById } from "@/domain/usecases/survey/load-survey-by-id";
import { SurveyModel } from "@/domain/models/survey";
import { LoadSurveys } from "@/domain/usecases/survey/load-surveys";
import { mockSurveyModel, mockSurveysModels } from "@/domain/tests";

export const mockAddSurvey = (): AddSurvey => {
  class AddSurveyStub implements AddSurvey {
    async add(data: AddSurveyParams): Promise<void> {
      return Promise.resolve();
    }
  }
  return new AddSurveyStub();
};

export const mockLoadSurveys = (): LoadSurveys => {
  class LoadSurveysStub implements LoadSurveys {
    async load(): Promise<SurveyModel[]> {
      return Promise.resolve(mockSurveysModels());
    }
  }
  return new LoadSurveysStub();
};

export const mockLoadSurveyById = (): LoadSurveyById => {
  class LoadSurveyByIdStub implements LoadSurveyById {
    async loadById(id: string): Promise<SurveyModel | null> {
      return Promise.resolve(mockSurveyModel());
    }
  }
  return new LoadSurveyByIdStub();
};
