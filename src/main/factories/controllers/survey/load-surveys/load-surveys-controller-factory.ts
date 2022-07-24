import { Controller } from "@/presentation/protocols";
import { LoadSurveysController } from "@/presentation/controllers/survey/load-surveys/load-surveys-controller";
import { makeLogControllerDecorator } from "@/main/factories/decorators/log-controller-decorator-factory";
import { makeDbLoadSurveys } from "@/main/factories/usecases/survey/load-surveys/db-load-surveys-factory";

export const makeLoadSurveysController = (): Controller => {
  const controller = new LoadSurveysController(makeDbLoadSurveys());
  return makeLogControllerDecorator(controller);
};
