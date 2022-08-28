export type SurveyModel = {
  id: string;
  question: string;
  answers: SurveyAnswerModel[];
  date: Date;
};

export type SurveyAnswerModel = {
  answerId: string;
  answer: string;
  image?: string;
};

export type AddSurveyModel = Omit<SurveyModel, "id" | "answers"> & {
  answers: Array<Omit<SurveyAnswerModel, "answerId">>;
};
