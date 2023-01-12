import { DbLoadSurveyResult } from './db-load-survey-result';
import {
  LoadSurveyResultRepositorySpy,
  LoadSurveyByIdRepositorySpy,
} from '@/data/tests';
import { throwError } from '@/domain/tests';
import MockDate from 'mockdate';
import { faker } from '@faker-js/faker';

type SutTypes = {
  sut: DbLoadSurveyResult;
  loadSurveyResultRepositorySpy: LoadSurveyResultRepositorySpy;
  loadSurveyByIdRepositorySpy: LoadSurveyByIdRepositorySpy;
};

const makeSut = (): SutTypes => {
  const loadSurveyByIdRepositorySpy = new LoadSurveyByIdRepositorySpy();
  const loadSurveyResultRepositorySpy = new LoadSurveyResultRepositorySpy();
  const sut = new DbLoadSurveyResult(
    loadSurveyResultRepositorySpy,
    loadSurveyByIdRepositorySpy
  );
  return { sut, loadSurveyResultRepositorySpy, loadSurveyByIdRepositorySpy };
};

let surveyId: string;
let accountId: string;

describe('DbLoadSurveyResult UseCase', () => {
  beforeAll(() => { MockDate.set(new Date()); });

  afterAll(() => { MockDate.reset(); });

  beforeEach(() => {
    surveyId = faker.datatype.uuid();
    accountId = faker.datatype.uuid();
  });

  test('Should call LoadSurveyResultRepository with correct values', async () => {
    const { sut, loadSurveyResultRepositorySpy } = makeSut();
    await sut.load(surveyId, accountId);
    expect(loadSurveyResultRepositorySpy.surveyId).toBe(surveyId);
    expect(loadSurveyResultRepositorySpy.accountId).toBe(accountId);
  });

  test('Should throw if LoadSurveyResultRepository throws', async () => {
    const { sut, loadSurveyResultRepositorySpy } = makeSut();
    jest
      .spyOn(loadSurveyResultRepositorySpy, 'loadBySurveyId')
      .mockImplementationOnce(throwError);
    const promise = sut.load(surveyId, accountId);
    await expect(promise).rejects.toThrow();
  });

  test('Should call LoadSurveyByIdRepository if LoadSurveyResultRepository returns null', async () => {
    const { sut, loadSurveyResultRepositorySpy, loadSurveyByIdRepositorySpy } =
      makeSut();
    loadSurveyResultRepositorySpy.surveyResultModel = null;
    await sut.load(surveyId, accountId);
    expect(loadSurveyByIdRepositorySpy.id).toBe(surveyId);
  });

  test("Should return null if LoadSurveyByIdRepository isn't exists", async () => {
    const { loadSurveyByIdRepositorySpy, loadSurveyResultRepositorySpy, sut } =
      makeSut();
    loadSurveyResultRepositorySpy.surveyResultModel = null;
    loadSurveyByIdRepositorySpy.surveyModel = null;
    const surveyResult = await sut.load(surveyId, accountId);
    expect(surveyResult).toBeNull();
  });

  test('Should return surveyResultModel with all answers with count and percent zero if LoadSurveyResultRepository returns null', async () => {
    const { sut, loadSurveyResultRepositorySpy, loadSurveyByIdRepositorySpy } =
      makeSut();
    loadSurveyResultRepositorySpy.surveyResultModel = null;
    const surveyResult = await sut.load(surveyId, accountId);
    const { surveyModel } = loadSurveyByIdRepositorySpy;
    expect(surveyResult).toEqual({
      surveyId: surveyModel.id,
      question: surveyModel.question,
      date: surveyModel.date,
      answers: surveyModel.answers.map(answer =>
        Object.assign({}, answer, {
          count: 0,
          percent: 0,
          isCurrentAccountAnswer: false,
        })
      ),
    });
  });

  test('Should return surveyResultModel on success', async () => {
    const { sut, loadSurveyResultRepositorySpy } = makeSut();
    const surveyResult = await sut.load(surveyId, accountId);
    expect(surveyResult).toEqual(
      loadSurveyResultRepositorySpy.surveyResultModel
    );
  });
});
