import {
  AddSurveyModel,
  SurveyModel,
  LoadSurveysRepository,
  AddSurveyRepository,
  LoadSurveyByIdRepository,
} from "./survey-mongo-repository-protocols";
import { MongoHelper } from "../helpers/mongodb-helper";

export class SurveyMongoRepository
  implements
    AddSurveyRepository,
    LoadSurveysRepository,
    LoadSurveyByIdRepository
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

  async loadById(id: string): Promise<SurveyModel> {
    const surveyCollection = await MongoHelper.getCollection("surveys");
    const surveyId = MongoHelper.toObjectId(id);
    const survey = await surveyCollection.findOne({
      _id: surveyId,
    });
    return survey && MongoHelper.assign<SurveyModel>(survey);
  }
}
