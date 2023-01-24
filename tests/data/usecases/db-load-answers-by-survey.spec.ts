import { DbLoadAnswersBySurvey } from '@/data/usecases';
import { throwError } from '@/../tests/domain/mocks';
import { LoadAnswersBySurveyRepositorySpy } from '@/../tests/data/mocks';
import { faker } from '@faker-js/faker';

type SutTypes = {
  sut: DbLoadAnswersBySurvey;
  loadAnswersBySurveyRepositorySpy: LoadAnswersBySurveyRepositorySpy;
};

const makeSut = (): SutTypes => {
  const loadAnswersBySurveyRepositorySpy =
    new LoadAnswersBySurveyRepositorySpy();
  const sut = new DbLoadAnswersBySurvey(loadAnswersBySurveyRepositorySpy);
  return {
    sut,
    loadAnswersBySurveyRepositorySpy,
  };
};

let surveyId: string;

describe('DbLoadAnswersBySurvey Usecase', () => {
  beforeEach(() => {
    surveyId = faker.datatype.uuid();
  });

  test('Should call LoadAnswersBySurveyRepository', async () => {
    const { sut, loadAnswersBySurveyRepositorySpy } = makeSut();
    await sut.loadAnswers(surveyId);
    expect(loadAnswersBySurveyRepositorySpy.id).toBe(surveyId);
  });

  test('Should throw if LoadAnswersBySurveyRepository throws', async () => {
    const { sut, loadAnswersBySurveyRepositorySpy } = makeSut();
    jest
      .spyOn(loadAnswersBySurveyRepositorySpy, 'loadAnswers')
      .mockImplementationOnce(throwError);
    const promise = sut.loadAnswers(surveyId);
    await expect(promise).rejects.toThrow();
  });

  test('Should return empty array if LoadAnswersBySurveyRepository returns empty array', async () => {
    const { sut, loadAnswersBySurveyRepositorySpy } = makeSut();
    loadAnswersBySurveyRepositorySpy.result = [];
    const answersId = await sut.loadAnswers(surveyId);
    expect(answersId).toEqual([]);
  });

  test('Should return answersId on success', async () => {
    const { sut, loadAnswersBySurveyRepositorySpy } = makeSut();
    const answersId = await sut.loadAnswers(surveyId);
    expect(answersId).toEqual([
      loadAnswersBySurveyRepositorySpy.result[0],
      loadAnswersBySurveyRepositorySpy.result[1],
    ]);
  });
});
