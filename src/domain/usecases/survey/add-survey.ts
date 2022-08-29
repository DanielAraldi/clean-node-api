import { AddSurveyModel } from "@/domain/models/survey";

export interface AddSurvey {
  add(data: AddSurveyModel): Promise<void>;
}
