import { SurveyAnswerModel, SurveyModel } from '@/domain/models';

export type AddSurveyParams = Omit<
  SurveyModel,
  'id' | 'answers' | 'didAnswer'
> & {
  answers: Array<Omit<SurveyAnswerModel, 'answerId'>>;
};

export interface AddSurvey {
  add(data: AddSurveyParams): Promise<void>;
}
