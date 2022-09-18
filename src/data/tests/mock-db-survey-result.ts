import { SaveSurveyResultRepository } from "@/data/protocols/db/survey-result/save-survey-result-repository";
import { SaveSurveyResultParams } from "@/domain/usecases/survey-result/save-survey-result";
import { SurveyResultModel } from "@/domain/models/survey-result";
import { mockSaveSurveyResultModel } from "@/domain/tests/mock-survey-result";

export const mockSaveSurveyResultRepository =
  (): SaveSurveyResultRepository => {
    class SaveSurveyResultRepositoryStub implements SaveSurveyResultRepository {
      async save(data: SaveSurveyResultParams): Promise<SurveyResultModel> {
        return Promise.resolve(mockSaveSurveyResultModel());
      }
    }
    return new SaveSurveyResultRepositoryStub();
  };
