import { MongoHelper } from "../helpers/mongodb-helper";
import {
  SaveSurveyResultParams,
  SaveSurveyResultRepository,
  SurveyResultModel,
} from "./survey-result-mongo-repository-protocols";

export class SurveyResultMongoRepository implements SaveSurveyResultRepository {
  async save(data: SaveSurveyResultParams): Promise<SurveyResultModel> {
    const surveyResultCollection = await MongoHelper.getCollection(
      "surveyResults"
    );
    const res = await surveyResultCollection.findOneAndUpdate(
      {
        surveyId: data.surveyId,
        accountId: data.accountId,
      },
      {
        $set: {
          answerId: data.answerId,
          date: data.date,
        },
      },
      {
        upsert: true, // create new document if it doesn't exist
        returnDocument: "after", // return the new document
      }
    );
    return res.value && MongoHelper.assign<SurveyResultModel>(res.value);
  }
}
