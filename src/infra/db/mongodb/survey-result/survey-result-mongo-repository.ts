import { MongoHelper, QueryBuilder } from '../helpers';
import { LoadSurveyResultRepository } from '@/data/protocols/db/survey-result/load-survey-result-repository';
import {
  SaveSurveyResultParams,
  SaveSurveyResultRepository,
  SurveyResultModel,
} from './survey-result-mongo-repository-protocols';

export class SurveyResultMongoRepository
  implements SaveSurveyResultRepository, LoadSurveyResultRepository
{
  async save(data: SaveSurveyResultParams): Promise<void> {
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
  }

  async loadBySurveyId(
    surveyId: string,
    accountId: string
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
        total: {
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
          total: '$total',
          answerId: '$data.answerId',
          answers: '$survey.answers',
        },
        count: {
          $sum: 1,
        },
        currentAccountAnswer: {
          $push: {
            $cond: [
              { $eq: ['$data.accountId', MongoHelper.objectId(accountId)] },
              '$data.answerId',
              '$invalid',
            ],
          },
        },
      })
      .builder('$project', {
        _id: 0,
        surveyId: '$_id.surveyId',
        question: '$_id.question',
        date: '$_id.date',
        answers: {
          $map: {
            input: '$_id.answers',
            as: 'item',
            in: {
              $mergeObjects: [
                '$$item',
                {
                  count: {
                    $cond: {
                      if: {
                        $eq: ['$$item.answerId', '$_id.answerId'],
                      },
                      then: '$count',
                      else: 0,
                    },
                  },
                  percent: {
                    $cond: {
                      if: {
                        $eq: ['$$item.answerId', '$_id.answerId'],
                      },
                      then: {
                        $multiply: [
                          {
                            $divide: ['$count', '$_id.total'],
                          },
                          100,
                        ],
                      },
                      else: 0,
                    },
                  },
                  isCurrentAccountAnswerCount: {
                    $cond: [
                      {
                        $eq: [
                          '$$item.answerId',
                          {
                            $arrayElemAt: ['$currentAccountAnswer', 0],
                          },
                        ],
                      },
                      1,
                      0,
                    ],
                  },
                },
              ],
            },
          },
        },
      })
      .builder('$group', {
        _id: {
          surveyId: '$surveyId',
          question: '$question',
          date: '$date',
        },
        answers: {
          $push: '$answers',
        },
      })
      .builder('$project', {
        _id: 0,
        surveyId: '$_id.surveyId',
        question: '$_id.question',
        date: '$_id.date',
        answers: {
          $reduce: {
            input: '$answers',
            initialValue: [],
            in: {
              $concatArrays: ['$$value', '$$this'],
            },
          },
        },
      })
      .builder('$unwind', {
        path: '$answers',
      })
      .builder('$group', {
        _id: {
          surveyId: '$surveyId',
          question: '$question',
          date: '$date',
          answerId: '$answers.answerId',
          answer: '$answers.answer',
          image: '$answers.image',
        },
        count: {
          $sum: '$answers.count',
        },
        percent: {
          $sum: '$answers.percent',
        },
        isCurrentAccountAnswerCount: {
          $sum: '$answers.isCurrentAccountAnswerCount',
        },
      })
      .builder('$project', {
        _id: 0,
        surveyId: '$_id.surveyId',
        question: '$_id.question',
        date: '$_id.date',
        answer: {
          answerId: '$_id.answerId',
          answer: '$_id.answer',
          image: '$_id.image',
          count: {
            $round: ['$count'],
          },
          percent: {
            $round: ['$percent'],
          },
          isCurrentAccountAnswer: {
            $eq: ['$isCurrentAccountAnswerCount', 1],
          },
        },
      })
      .builder('$sort', {
        'answer.count': -1,
      })
      .builder('$group', {
        _id: {
          surveyId: '$surveyId',
          question: '$question',
          date: '$date',
        },
        answers: {
          $push: '$answer',
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
    return surveyResult.length ? (surveyResult[0] as SurveyResultModel) : null;
  }
}
