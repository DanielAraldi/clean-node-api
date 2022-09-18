import { SurveyModel } from "@/domain/models/survey";
import { AddSurveyParams } from "@/domain/usecases/survey/add-survey";

export const mockSurveyModel = (): SurveyModel => ({
  id: "any_id",
  question: "any_question",
  answers: [
    {
      answerId: "any_answer_id",
      image: "any_image",
      answer: "any_answer",
    },
  ],
  date: new Date(),
});

export const mockSurveysModels = (): SurveyModel[] => [
  {
    id: "any_id",
    question: "any_question",
    answers: [
      {
        answerId: "any_answer_id",
        image: "any_image",
        answer: "any_answer",
      },
    ],
    date: new Date(),
  },
  {
    id: "other_id",
    question: "other_question",
    answers: [
      {
        answerId: "other_answer_id",
        image: "other_image",
        answer: "other_answer",
      },
    ],
    date: new Date(),
  },
];

export const mockAddSurveyParams = (): AddSurveyParams => ({
  question: "any_question",
  answers: [
    {
      image: "any_image",
      answer: "any_answer",
    },
  ],
  date: new Date(),
});
