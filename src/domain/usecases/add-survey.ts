import { SurveyAnswerModel, SurveyModel } from '@/domain/models';

export interface AddSurvey {
  add(data: AddSurvey.Params): Promise<void>;
}

export namespace AddSurvey {
  export type Params = Omit<SurveyModel, 'id' | 'answers' | 'didAnswer'> & {
    answers: Array<Omit<SurveyAnswerModel, 'answerId'>>;
  };
}
