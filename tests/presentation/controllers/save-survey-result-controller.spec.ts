import { SaveSurveyResultController } from '@/presentation/controllers';
import { InvalidParamError } from '@/presentation/errors';
import { forbidden, serverError, ok, badRequest } from '@/presentation/helpers';
import {
  SaveSurveyResultSpy,
  LoadAnswersBySurveySpy,
  ValidationSpy,
} from '@/../tests/presentation/mocks';
import { throwError } from '@/../tests/domain/mocks';
import MockDate from 'mockdate';
import { faker } from '@faker-js/faker';

const mockRequest = (
  answerId: string = null
): SaveSurveyResultController.Request => ({
  answerId,
  surveyId: faker.datatype.uuid(),
  accountId: faker.datatype.uuid(),
});

type SutTypes = {
  sut: SaveSurveyResultController;
  validationSpy: ValidationSpy;
  loadAnswersBySurvey: LoadAnswersBySurveySpy;
  saveSurveyResultSpy: SaveSurveyResultSpy;
};

const makeSut = (): SutTypes => {
  const validationSpy = new ValidationSpy();
  const loadAnswersBySurvey = new LoadAnswersBySurveySpy();
  const saveSurveyResultSpy = new SaveSurveyResultSpy();
  const sut = new SaveSurveyResultController(
    validationSpy,
    loadAnswersBySurvey,
    saveSurveyResultSpy
  );
  return { sut, validationSpy, loadAnswersBySurvey, saveSurveyResultSpy };
};

describe('SaveSurveyResult Controller', () => {
  beforeAll(() => {
    MockDate.set(new Date());
  });

  afterAll(() => {
    MockDate.reset();
  });

  test('Should call Validation with correct values', async () => {
    const { sut, validationSpy } = makeSut();
    validationSpy.error = new Error();
    const request = mockRequest();
    await sut.handle(request);
    expect(validationSpy.error).toBe(validationSpy.error);
  });

  test('Should return 400 if Validation fails', async () => {
    const { sut, validationSpy } = makeSut();
    validationSpy.error = new Error();
    const httpResponse = await sut.handle(mockRequest());
    expect(httpResponse).toEqual(badRequest(new Error()));
  });

  test('Should call LoadAnswersBySurvey with correct values', async () => {
    const { sut, loadAnswersBySurvey } = makeSut();
    const request = mockRequest();
    await sut.handle(request);
    expect(loadAnswersBySurvey.id).toBe(request.surveyId);
  });

  test('Should return 403 if LoadAnswersBySurvey returns null', async () => {
    const { sut, loadAnswersBySurvey } = makeSut();
    loadAnswersBySurvey.result = [];
    const httpResponse = await sut.handle(mockRequest());
    expect(httpResponse).toEqual(forbidden(new InvalidParamError('surveyId')));
  });

  test('Should return 403 if an invalid answer is provided', async () => {
    const { sut } = makeSut();
    const httpResponse = await sut.handle(mockRequest());
    expect(httpResponse).toEqual(forbidden(new InvalidParamError('answerId')));
  });

  test('Should return 500 if LoadSurveyById throws', async () => {
    const { sut, loadAnswersBySurvey } = makeSut();
    jest
      .spyOn(loadAnswersBySurvey, 'loadAnswers')
      .mockImplementationOnce(throwError);
    const httpResponse = await sut.handle(mockRequest());
    expect(httpResponse).toEqual(serverError(new Error()));
  });

  test('Should call SaveSurveyResult with correct values', async () => {
    const { sut, saveSurveyResultSpy, loadAnswersBySurvey } = makeSut();
    const request = mockRequest(loadAnswersBySurvey.result[0]);
    await sut.handle(request);
    expect(saveSurveyResultSpy.saveSurveyResultParams).toEqual({
      surveyId: request.surveyId,
      accountId: request.accountId,
      date: new Date(),
      answerId: request.answerId,
    });
  });

  test('Should return 500 if SaveSurveyResult throws', async () => {
    const { sut, saveSurveyResultSpy, loadAnswersBySurvey } = makeSut();
    jest.spyOn(saveSurveyResultSpy, 'save').mockImplementationOnce(throwError);
    const request = mockRequest(loadAnswersBySurvey.result[0]);
    const httpResponse = await sut.handle(request);
    expect(httpResponse).toEqual(serverError(new Error()));
  });

  test('Should return 200 on success', async () => {
    const { sut, saveSurveyResultSpy, loadAnswersBySurvey } = makeSut();
    const request = mockRequest(loadAnswersBySurvey.result[0]);
    const httpResponse = await sut.handle(request);
    expect(httpResponse).toEqual(ok(saveSurveyResultSpy.result));
  });
});
