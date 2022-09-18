import { AddSurveyRepository } from "@/data/protocols/db/survey/add-survey-repository";
import { AddSurveyParams } from "@/domain/usecases/survey/add-survey";
import { LoadSurveyByIdRepository } from "@/data/protocols/db/survey/load-survey-by-id-repository";
import { LoadSurveysRepository } from "@/data/protocols/db/survey/load-surveys-repository";
import { SurveyModel } from "@/domain/models/survey";
import { mockSurveyModel, mockSurveysModels } from "@/domain/tests";

export const mockAddSurveyRepository = (): AddSurveyRepository => {
  class AddSurveyRepositoryStub implements AddSurveyRepository {
    async add(surveyData: AddSurveyParams): Promise<void> {
      return new Promise((resolve) => resolve());
    }
  }
  return new AddSurveyRepositoryStub();
};

export const mockLoadSurveyByIdRepository = (): LoadSurveyByIdRepository => {
  class LoadSurveyByIdRepositoryStub implements LoadSurveyByIdRepository {
    async loadById(id: string): Promise<SurveyModel | null> {
      return new Promise((resolve) => resolve(mockSurveyModel()));
    }
  }
  return new LoadSurveyByIdRepositoryStub();
};

export const mockLoadSurveysRepository = (): LoadSurveysRepository => {
  class LoadSurveysRepositoryStub implements LoadSurveysRepository {
    async loadAll(): Promise<SurveyModel[]> {
      return new Promise((resolve) => resolve(mockSurveysModels()));
    }
  }
  return new LoadSurveysRepositoryStub();
};
