import { SaveSurveyResultParams } from '@/domain/usecases/survey-result/save-survey-result';
import { SurveyResultModel } from '@/domain/models/survey-result';
import { faker } from '@faker-js/faker';

export const mockSaveSurveyResultParams = (): SaveSurveyResultParams => ({
  accountId: faker.datatype.uuid(),
  surveyId: faker.datatype.uuid(),
  answerId: faker.datatype.uuid(),
  date: faker.date.recent(),
});

export const mockSaveSurveyResultModel = (): SurveyResultModel => ({
  answers: [
    {
      answer: faker.random.word(),
      answerId: faker.datatype.uuid(),
      count: faker.datatype.number({ min: 0, max: 1000 }),
      percent: faker.datatype.number({ min: 0, max: 100 }),
      image: faker.image.imageUrl(),
    },
    {
      answer: faker.random.word(),
      answerId: faker.datatype.uuid(),
      count: faker.datatype.number({ min: 0, max: 1000 }),
      percent: faker.datatype.number({ min: 0, max: 100 }),
      image: faker.image.imageUrl(),
    },
  ],
  date: faker.date.recent(),
  question: faker.random.words(),
  surveyId: faker.datatype.uuid(),
});
