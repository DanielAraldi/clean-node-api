import {
  makeLogControllerDecorator,
  makeDbLoadSurveyById,
  makeDbSaveSurveyResult,
  makeSaveSurveyResultValidation,
} from '@/main/factories';
import { Controller } from '@/presentation/protocols';
import { SaveSurveyResultController } from '@/presentation/controllers';

export const makeSaveSurveyResultController = (): Controller => {
  const controller = new SaveSurveyResultController(
    makeSaveSurveyResultValidation(),
    makeDbLoadSurveyById(),
    makeDbSaveSurveyResult()
  );
  return makeLogControllerDecorator(controller);
};
