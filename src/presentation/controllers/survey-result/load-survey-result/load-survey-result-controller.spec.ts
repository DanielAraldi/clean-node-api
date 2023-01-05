import { LoadSurveyResultController } from './load-survey-result-controller';
import {
  HttpRequest,
  LoadSurveyById,
  forbidden,
  InvalidParamError,
  serverError,
  LoadSurveyResult,
  ok,
} from './load-survey-result-protocols';
import { mockLoadSurveyById, mockLoadSurveyResult } from '@/presentation/tests';
import { mockSaveSurveyResultModel, throwError } from '@/domain/tests';
import MockDate from 'mockdate';

const mockRequest = (): HttpRequest => ({
  params: {
    surveyId: 'any_id',
  },
});

type SutTypes = {
  sut: LoadSurveyResultController;
  loadSurveyByIdStub: LoadSurveyById;
  loadSurveyResultStub: LoadSurveyResult;
};

const makeSut = (): SutTypes => {
  const loadSurveyByIdStub = mockLoadSurveyById();
  const loadSurveyResultStub = mockLoadSurveyResult();
  const sut = new LoadSurveyResultController(
    loadSurveyByIdStub,
    loadSurveyResultStub
  );
  return { sut, loadSurveyByIdStub, loadSurveyResultStub };
};

describe('LoadSurveyResult Controller', () => {
  beforeAll(() => MockDate.set(new Date()));

  afterAll(() => MockDate.reset());

  test('Should call LoadSurveyById with correct value', async () => {
    const { loadSurveyByIdStub, sut } = makeSut();
    const loadByIdSpy = jest.spyOn(loadSurveyByIdStub, 'loadById');
    await sut.handle(mockRequest());
    expect(loadByIdSpy).toHaveBeenCalledWith('any_id');
  });

  test('Should return 403 if LoadSurveyById returns null', async () => {
    const { loadSurveyByIdStub, sut } = makeSut();
    jest
      .spyOn(loadSurveyByIdStub, 'loadById')
      .mockReturnValueOnce(Promise.resolve(null));
    const httpResponse = await sut.handle(mockRequest());
    expect(httpResponse).toEqual(forbidden(new InvalidParamError('surveyId')));
  });

  test('Should return 500 if LoadSurveyById throws', async () => {
    const { loadSurveyByIdStub, sut } = makeSut();
    jest
      .spyOn(loadSurveyByIdStub, 'loadById')
      .mockImplementationOnce(throwError);
    const httpResponse = await sut.handle(mockRequest());
    expect(httpResponse).toEqual(serverError(new Error()));
  });

  test('Should call LoadSurveyResult with correct value', async () => {
    const { loadSurveyResultStub, sut } = makeSut();
    const loadSpy = jest.spyOn(loadSurveyResultStub, 'load');
    await sut.handle(mockRequest());
    expect(loadSpy).toHaveBeenCalledWith('any_id');
  });

  test('Should return 500 if LoadSurveyResult throws', async () => {
    const { loadSurveyResultStub, sut } = makeSut();
    jest.spyOn(loadSurveyResultStub, 'load').mockImplementationOnce(throwError);
    const httpResponse = await sut.handle(mockRequest());
    expect(httpResponse).toEqual(serverError(new Error()));
  });

  test('Should return 403 if LoadSurveyResult returns null', async () => {
    const { loadSurveyResultStub, sut } = makeSut();
    jest
      .spyOn(loadSurveyResultStub, 'load')
      .mockReturnValueOnce(Promise.resolve(null));
    const httpResponse = await sut.handle(mockRequest());
    expect(httpResponse).toEqual(forbidden(new InvalidParamError('surveyId')));
  });

  test('Should return 200 on success', async () => {
    const { sut } = makeSut();
    const httpResponse = await sut.handle(mockRequest());
    expect(httpResponse).toEqual(ok(mockSaveSurveyResultModel()));
  });
});
