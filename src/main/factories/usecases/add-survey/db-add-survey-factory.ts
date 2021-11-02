import { SurveyMongoRepository } from "../../../../infra/db/mongodb/survey/survey-mongo-repository";
import { DbAddSurvey } from "../../../../data/usecases/add-survey/db-add-survey";
import { AddSurvey } from "../../../../domain/usecases/add-survey";

export const makeDbAddSurvey = (): AddSurvey => {
  const surveyMongoRepository = new SurveyMongoRepository();
  return new DbAddSurvey(surveyMongoRepository);
};
