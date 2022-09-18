import {
  AddSurveyParams,
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
  async add(surveyData: AddSurveyParams): Promise<void> {
    const surveyCollection = await MongoHelper.getCollection("surveys");
    const surveysAnswers = surveyData.answers.map((survey) => ({
      ...survey,
      answerId: MongoHelper.objectId(),
    }));
    await surveyCollection.insertOne({
      ...surveyData,
      answers: surveysAnswers,
    });
  }

  async loadAll(): Promise<SurveyModel[]> {
    const surveyCollection = await MongoHelper.getCollection("surveys");
    const surveys = await surveyCollection.find().toArray();
    return MongoHelper.map<SurveyModel>(surveys);
  }

  async loadById(id: string): Promise<SurveyModel | null> {
    const surveyCollection = await MongoHelper.getCollection("surveys");
    const surveyId = MongoHelper.objectId(id);
    const survey = await surveyCollection.findOne({
      _id: surveyId,
    });
    return survey && MongoHelper.assign<SurveyModel>(survey);
  }
}
