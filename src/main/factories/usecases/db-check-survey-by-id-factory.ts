import { SurveyMongoRepository } from '@/infra/db';
import { DbCheckSurveyById } from '@/data/usecases';
import { CheckSurveyById } from '@/domain/usecases';

export const makeDbCheckSurveyById = (): CheckSurveyById => {
  const surveyMongoRepository = new SurveyMongoRepository();
  return new DbCheckSurveyById(surveyMongoRepository);
};
