import { SurveyModel } from '@/domain/models';
import { AddSurvey } from '@/domain/usecases';
import { faker } from '@faker-js/faker';

export const mockSurveyModel = (): SurveyModel => ({
  id: faker.datatype.uuid(),
  question: faker.random.words(),
  answers: [
    {
      answer: faker.random.word(),
      answerId: faker.datatype.uuid(),
      image: faker.image.imageUrl(),
    },
    {
      answer: faker.random.word(),
      answerId: faker.datatype.uuid(),
      image: faker.image.imageUrl(),
    },
  ],
  date: faker.date.recent(),
});

export const mockSurveysModels = (): SurveyModel[] => [
  mockSurveyModel(),
  mockSurveyModel(),
];

export const mockAddSurveyParams = (): AddSurvey.Params => ({
  question: faker.random.words(),
  answers: [
    {
      image: faker.image.imageUrl(),
      answer: faker.random.word(),
    },
    {
      answer: faker.random.word(),
    },
  ],
  date: faker.date.recent(),
});
