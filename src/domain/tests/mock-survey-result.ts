import { SaveSurveyResultParams } from "@/domain/usecases/survey-result/save-survey-result";
import { SurveyResultModel } from "@/domain/models/survey-result";

export const mockSaveSurveyResultParams = (): SaveSurveyResultParams => ({
  accountId: "any_account_id",
  surveyId: "any_survey_id",
  answerId: "any_answer_id",
  date: new Date(),
});

export const mockSaveSurveyResultModel = (): SurveyResultModel =>
  Object.assign({}, mockSaveSurveyResultParams(), { id: "any_id" });
