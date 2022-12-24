export type SurveyResultModel = {
  surveyId: string;
  question: string;
  answers: SurveyResultAnswerModel[];
  date: Date;
};

type SurveyResultAnswerModel = {
  answerId: string;
  answer: string;
  count: number;
  percent: number;
  image?: string;
};
