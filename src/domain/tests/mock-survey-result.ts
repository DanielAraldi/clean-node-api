import { SaveSurveyResultParams } from '@/domain/usecases/survey-result/save-survey-result';
import { SurveyResultModel } from '@/domain/models/survey-result';

export const mockSaveSurveyResultParams = (): SaveSurveyResultParams => ({
  accountId: 'any_account_id',
  surveyId: 'any_survey_id',
  answerId: 'any_answer_id',
  date: new Date(),
});

export const mockSaveSurveyResultModel = (): SurveyResultModel => ({
  answers: [
    {
      answer: 'any_answer',
      answerId: 'any_answer_id',
      count: 0,
      percent: 0,
      image: 'any_image',
    },
    {
      answer: 'other_answer',
      answerId: 'other_answer_id',
      count: 0,
      percent: 0,
      image: 'other_image',
    },
  ],
  date: new Date(),
  question: 'any_question',
  surveyId: 'any_id',
});
