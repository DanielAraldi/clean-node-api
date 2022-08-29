import { makeLogControllerDecorator } from "@/main/factories/decorators/log-controller-decorator-factory";
import { makeDbSaveSurveyResult } from "@/main/factories/usecases/survey-result/save-survey-result/db-save-survey-result-factory";
import { makeDbLoadSurveyById } from "@/main/factories/usecases/survey/load-survey-by-id/db-load-survey-by-id-factory";
import { SaveSurveyResultController } from "@/presentation/controllers/survey-result/save-survey-result/save-survey-result-controller";
import { Controller } from "@/presentation/protocols";
import { makeSaveSurveyResultValidation } from "./save-survey-result-validation-factory";

export const makeSaveSurveyResultController = (): Controller => {
  const controller = new SaveSurveyResultController(
    makeSaveSurveyResultValidation(),
    makeDbLoadSurveyById(),
    makeDbSaveSurveyResult()
  );
  return makeLogControllerDecorator(controller);
};
