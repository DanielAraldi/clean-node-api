import { SurveyAnswerModel } from "../models/survey";

export interface AddSurveyModel {
  question: string;
  answers: SurveyAnswerModel[];
  date: Date;
}

export interface AddSurvey {
  add(data: AddSurveyModel): Promise<void>;
}
