import { DbLoadAnswersBySurvey } from '@/data/usecases';
import { throwError } from '@/../tests/domain/mocks';
import { LoadSurveyByIdRepositorySpy } from '@/../tests/data/mocks';
import { faker } from '@faker-js/faker';

type SutTypes = {
  sut: DbLoadAnswersBySurvey;
  loadSurveyByIdRepositorySpy: LoadSurveyByIdRepositorySpy;
};

const makeSut = (): SutTypes => {
  const loadSurveyByIdRepositorySpy = new LoadSurveyByIdRepositorySpy();
  const sut = new DbLoadAnswersBySurvey(loadSurveyByIdRepositorySpy);
  return {
    sut,
    loadSurveyByIdRepositorySpy,
  };
};

let surveyId: string;

describe('DbLoadAnswersBySurvey Usecase', () => {
  beforeEach(() => {
    surveyId = faker.datatype.uuid();
  });

  test('Should call LoadSurveyByIdRepository', async () => {
    const { sut, loadSurveyByIdRepositorySpy } = makeSut();
    await sut.loadAnswers(surveyId);
    expect(loadSurveyByIdRepositorySpy.id).toBe(surveyId);
  });

  test('Should throw if LoadSurveyByIdRepository throws', async () => {
    const { sut, loadSurveyByIdRepositorySpy } = makeSut();
    jest
      .spyOn(loadSurveyByIdRepositorySpy, 'loadById')
      .mockImplementationOnce(throwError);
    const promise = sut.loadAnswers(surveyId);
    await expect(promise).rejects.toThrow();
  });

  test('Should return empty array if LoadSurveyByIdRepository returns null', async () => {
    const { sut, loadSurveyByIdRepositorySpy } = makeSut();
    loadSurveyByIdRepositorySpy.result = null;
    const answersId = await sut.loadAnswers(surveyId);
    expect(answersId).toEqual([]);
  });

  test('Should return answersId on success', async () => {
    const { sut, loadSurveyByIdRepositorySpy } = makeSut();
    const answersId = await sut.loadAnswers(surveyId);
    expect(answersId).toEqual([
      loadSurveyByIdRepositorySpy.result.answers[0].answerId,
      loadSurveyByIdRepositorySpy.result.answers[1].answerId,
    ]);
  });
});
