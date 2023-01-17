import { SaveSurveyResultParams } from '@/domain/usecases';
import { SurveyResultModel } from '@/domain/models';
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
      isCurrentAccountAnswer: faker.datatype.boolean(),
    },
    {
      answer: faker.random.word(),
      answerId: faker.datatype.uuid(),
      count: faker.datatype.number({ min: 0, max: 1000 }),
      percent: faker.datatype.number({ min: 0, max: 100 }),
      image: faker.image.imageUrl(),
      isCurrentAccountAnswer: faker.datatype.boolean(),
    },
  ],
  date: faker.date.recent(),
  question: faker.random.words(),
  surveyId: faker.datatype.uuid(),
});
