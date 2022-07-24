import {
  AddSurveyModel,
  SurveyModel,
  LoadSurveysRepository,
  AddSurveyRepository,
} from "./survey-mongo-repository-protocols";
import { MongoHelper } from "../helpers/mongodb-helper";

export class SurveyMongoRepository
  implements AddSurveyRepository, LoadSurveysRepository
{
  async add(surveyData: AddSurveyModel): Promise<void> {
    const surveyCollection = await MongoHelper.getCollection("surveys");
    await surveyCollection.insertOne(surveyData);
  }

  async loadAll(): Promise<SurveyModel[]> {
    const surveyCollection = await MongoHelper.getCollection("surveys");
    const surveys = await surveyCollection.find().toArray();
    return surveys && MongoHelper.map<SurveyModel>(surveys);
  }
}
