import { SurveyAnswerModel, SurveyModel } from "@/domain/models/survey";

export type AddSurveyParams = Omit<SurveyModel, "id" | "answers"> & {
  answers: Array<Omit<SurveyAnswerModel, "answerId">>;
};

export interface AddSurvey {
  add(data: AddSurveyParams): Promise<void>;
}
