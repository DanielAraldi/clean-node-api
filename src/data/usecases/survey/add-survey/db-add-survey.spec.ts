import { DbAddSurvey } from './db-add-survey';
import { throwError, mockAddSurveyParams } from '@/domain/tests';
import { AddSurveyRepositorySpy } from '@/data/tests';
import MockDate from 'mockdate';

type SutTypes = {
  sut: DbAddSurvey;
  addSurveyRepositorySpy: AddSurveyRepositorySpy;
};

const makeSut = (): SutTypes => {
  const addSurveyRepositorySpy = new AddSurveyRepositorySpy();
  const sut = new DbAddSurvey(addSurveyRepositorySpy);
  return {
    sut,
    addSurveyRepositorySpy,
  };
};

describe('DbAddSurvey Usecase', () => {
  beforeAll(() => { MockDate.set(new Date()); });

  afterAll(() => { MockDate.reset(); });

  test('Should call AddSurveyRepository with correct values', async () => {
    const { addSurveyRepositorySpy, sut } = makeSut();
    const surveyData = mockAddSurveyParams();
    await sut.add(surveyData);
    expect(addSurveyRepositorySpy.addSurveyParams).toEqual(surveyData);
  });

  test('Should throw if AddSurveyRepository throws', async () => {
    const { addSurveyRepositorySpy, sut } = makeSut();
    jest
      .spyOn(addSurveyRepositorySpy, 'add')
      .mockImplementationOnce(throwError);
    const promise = sut.add(mockAddSurveyParams());
    await expect(promise).rejects.toThrow();
  });
});
