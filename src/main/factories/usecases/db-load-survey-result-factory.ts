import { LoadSurveyResult } from '@/domain/usecases';
import { DbLoadSurveyResult } from '@/data/usecases';
import { SurveyResultMongoRepository, SurveyMongoRepository } from '@/infra/db';

export const makeDbLoadSurveyResult = (): LoadSurveyResult => {
  const surveyMongoRepository = new SurveyMongoRepository();
  const surveyResultMongoRepository = new SurveyResultMongoRepository();
  return new DbLoadSurveyResult(
    surveyResultMongoRepository,
    surveyMongoRepository
  );
};
