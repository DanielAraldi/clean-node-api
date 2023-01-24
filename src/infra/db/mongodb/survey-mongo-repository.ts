import { MongoHelper, QueryBuilder } from '@/infra/db';
import { SurveyModel } from '@/domain/models';
import {
  AddSurveyRepository,
  CheckSurveyByIdRepository,
  LoadAnswersBySurveyRepository,
  LoadSurveysRepository,
  LoadSurveyByIdRepository,
} from '@/data/protocols/db';

export class SurveyMongoRepository
  implements
    AddSurveyRepository,
    CheckSurveyByIdRepository,
    LoadAnswersBySurveyRepository,
    LoadSurveysRepository,
    LoadSurveyByIdRepository
{
  async add(data: AddSurveyRepository.Params): Promise<void> {
    const surveyCollection = await MongoHelper.getCollection('surveys');
    const surveysAnswers = data.answers.map(survey => ({
      ...survey,
      answerId: MongoHelper.objectId(),
    }));
    await surveyCollection.insertOne({
      ...data,
      answers: surveysAnswers,
    });
  }

  async loadAll(accountId: string): Promise<SurveyModel[]> {
    const surveyCollection = await MongoHelper.getCollection('surveys');

    const query = new QueryBuilder()
      .builder('$lookup', {
        from: 'surveyResults',
        foreignField: 'surveyId',
        localField: '_id',
        as: 'result',
      })
      .builder('$project', {
        _id: 1,
        question: 1,
        answers: 1,
        date: 1,
        didAnswer: {
          $gte: [
            {
              $size: {
                $filter: {
                  input: '$result',
                  as: 'item',
                  cond: {
                    $eq: ['$$item.accountId', MongoHelper.objectId(accountId)],
                  },
                },
              },
            },
            1,
          ],
        },
      })
      .build();

    const surveys = await surveyCollection.aggregate(query).toArray();
    return MongoHelper.map<SurveyModel>(surveys);
  }

  async loadById(id: string): Promise<LoadSurveyByIdRepository.Result> {
    const surveyCollection = await MongoHelper.getCollection('surveys');
    const surveyId = MongoHelper.objectId(id);
    const survey = await surveyCollection.findOne({
      _id: surveyId,
    });
    return survey && MongoHelper.assign<SurveyModel>(survey);
  }

  async loadAnswers(id: string): Promise<LoadAnswersBySurveyRepository.Result> {
    const surveyCollection = await MongoHelper.getCollection('surveys');
    const surveyId = MongoHelper.objectId(id);
    const query = new QueryBuilder()
      .builder('$match', {
        _id: surveyId,
      })
      .builder('$project', {
        _id: 0,
        answers: '$answers.answerId',
      })
      .build();

    const surveys = await surveyCollection.aggregate(query).toArray();
    return surveys[0]?.answers || [];
  }

  async checkById(id: string): Promise<CheckSurveyByIdRepository.Result> {
    const surveyCollection = await MongoHelper.getCollection('surveys');
    const surveyId = MongoHelper.objectId(id);
    const survey = await surveyCollection.findOne(
      {
        _id: surveyId,
      },
      { projection: { _id: 1 } }
    );
    return !!survey;
  }
}
