import { MongoHelper, QueryBuilder } from '../helpers';
import {
  SaveSurveyResultParams,
  SaveSurveyResultRepository,
  SurveyResultModel,
} from './survey-result-mongo-repository-protocols';

export class SurveyResultMongoRepository implements SaveSurveyResultRepository {
  async save(data: SaveSurveyResultParams): Promise<SurveyResultModel | null> {
    const surveyResultCollection = await MongoHelper.getCollection(
      'surveyResults'
    );
    await surveyResultCollection.findOneAndUpdate(
      {
        surveyId: MongoHelper.objectId(data.surveyId),
        accountId: MongoHelper.objectId(data.accountId),
      },
      {
        $set: {
          answerId: MongoHelper.objectId(data.answerId),
          date: data.date,
        },
      },
      {
        upsert: true,
      }
    );
    const surveyResult = await this.loadBySurveyId(data.surveyId);
    return surveyResult;
  }

  private async loadBySurveyId(
    surveyId: string
  ): Promise<SurveyResultModel | null> {
    const surveyResultCollection = await MongoHelper.getCollection(
      'surveyResults'
    );
    const query = new QueryBuilder()
      .builder('$match', {
        surveyId: MongoHelper.objectId(surveyId),
      })
      .builder('$group', {
        _id: 0,
        data: {
          $push: '$$ROOT',
        },
        count: {
          $sum: 1,
        },
      })
      .builder('$unwind', {
        path: '$data',
      })
      .builder('$lookup', {
        from: 'surveys',
        foreignField: '_id',
        localField: 'data.surveyId',
        as: 'survey',
      })
      .builder('$unwind', {
        path: '$survey',
      })
      .builder('$group', {
        _id: {
          surveyId: '$survey._id',
          question: '$survey.question',
          date: '$survey.date',
          total: '$count',
          answer: {
            $filter: {
              input: '$survey.answers',
              as: 'item',
              cond: {
                $eq: ['$$item.answerId', '$data.answerId'],
              },
            },
          },
        },
        count: {
          $sum: 1,
        },
      })
      .builder('$unwind', {
        path: '$_id.answer',
      })
      .builder('$addFields', {
        '_id.answer.count': '$count',
        '_id.answer.percent': {
          $multiply: [
            {
              $divide: ['$count', '$_id.total'],
            },
            100
          ],
        },
      })
      .builder('$group', {
        _id: {
          surveyId: '$_id.surveyId',
          question: '$_id.question',
          date: '$_id.date',
        },
        answers: {
          $push: '$_id.answer',
        },
      })
      .builder('$project', {
        _id: 0,
        surveyId: '$_id.surveyId',
        question: '$_id.question',
        date: '$_id.date',
        answers: '$answers',
      })
      .build();

    const surveyResult = await surveyResultCollection
      .aggregate(query)
      .toArray();
    return surveyResult?.length ? (surveyResult[0] as SurveyResultModel) : null;
  }
}
