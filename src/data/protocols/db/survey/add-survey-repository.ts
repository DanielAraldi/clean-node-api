import { AddSurveyModel } from "@/domain/models/survey";

export interface AddSurveyRepository {
  add(surveyData: AddSurveyModel): Promise<void>;
}
