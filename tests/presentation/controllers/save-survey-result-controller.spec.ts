import { SaveSurveyResultController } from '@/presentation/controllers';
import { HttpRequest } from '@/presentation/protocols';
import { InvalidParamError } from '@/presentation/errors';
import { forbidden, serverError, ok, badRequest } from '@/presentation/helpers';
import {
  SaveSurveyResultSpy,
  LoadSurveyByIdSpy,
  ValidationSpy,
} from '@/../tests/presentation/mocks';
import { throwError } from '@/../tests/domain/mocks';
import MockDate from 'mockdate';
import { faker } from '@faker-js/faker';

const mockRequest = (answerId: string = null): HttpRequest => ({
  params: {
    surveyId: faker.datatype.uuid(),
  },
  body: {
    answerId,
  },
  accountId: faker.datatype.uuid(),
});

type SutTypes = {
  sut: SaveSurveyResultController;
  validationSpy: ValidationSpy;
  loadSurveyByIdSpy: LoadSurveyByIdSpy;
  saveSurveyResultSpy: SaveSurveyResultSpy;
};

const makeSut = (): SutTypes => {
  const validationSpy = new ValidationSpy();
  const loadSurveyByIdSpy = new LoadSurveyByIdSpy();
  const saveSurveyResultSpy = new SaveSurveyResultSpy();
  const sut = new SaveSurveyResultController(
    validationSpy,
    loadSurveyByIdSpy,
    saveSurveyResultSpy
  );
  return { sut, validationSpy, loadSurveyByIdSpy, saveSurveyResultSpy };
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
    const httpRequest = mockRequest();
    await sut.handle(httpRequest);
    expect(validationSpy.error).toBe(validationSpy.error);
  });

  test('Should return 400 if Validation fails', async () => {
    const { sut, validationSpy } = makeSut();
    validationSpy.error = new Error();
    const httpResponse = await sut.handle(mockRequest());
    expect(httpResponse).toEqual(badRequest(new Error()));
  });

  test('Should call LoadSurveyById with correct values', async () => {
    const { sut, loadSurveyByIdSpy } = makeSut();
    const httpRequest = mockRequest();
    await sut.handle(httpRequest);
    expect(loadSurveyByIdSpy.id).toBe(httpRequest.params.surveyId);
  });

  test('Should return 403 if LoadSurveyById returns null', async () => {
    const { sut, loadSurveyByIdSpy } = makeSut();
    loadSurveyByIdSpy.surveyModel = null;
    const httpResponse = await sut.handle(mockRequest());
    expect(httpResponse).toEqual(forbidden(new InvalidParamError('surveyId')));
  });

  test('Should return 403 if an invalid answer is provided', async () => {
    const { sut } = makeSut();
    const httpResponse = await sut.handle(mockRequest());
    expect(httpResponse).toEqual(forbidden(new InvalidParamError('answerId')));
  });

  test('Should return 500 if LoadSurveyById throws', async () => {
    const { sut, loadSurveyByIdSpy } = makeSut();
    jest
      .spyOn(loadSurveyByIdSpy, 'loadById')
      .mockImplementationOnce(throwError);
    const httpResponse = await sut.handle(mockRequest());
    expect(httpResponse).toEqual(serverError(new Error()));
  });

  test('Should call SaveSurveyResult with correct values', async () => {
    const { sut, saveSurveyResultSpy, loadSurveyByIdSpy } = makeSut();
    const httpRequest = mockRequest(
      loadSurveyByIdSpy.surveyModel.answers[0].answerId
    );
    await sut.handle(httpRequest);
    expect(saveSurveyResultSpy.saveSurveyResultParams).toEqual({
      surveyId: httpRequest.params.surveyId,
      accountId: httpRequest.accountId,
      date: new Date(),
      answerId: httpRequest.body.answerId,
    });
  });

  test('Should return 500 if SaveSurveyResult throws', async () => {
    const { sut, saveSurveyResultSpy, loadSurveyByIdSpy } = makeSut();
    jest.spyOn(saveSurveyResultSpy, 'save').mockImplementationOnce(throwError);
    const httpRequest = mockRequest(
      loadSurveyByIdSpy.surveyModel.answers[0].answerId
    );
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(serverError(new Error()));
  });

  test('Should return 200 on success', async () => {
    const { sut, saveSurveyResultSpy, loadSurveyByIdSpy } = makeSut();
    const httpRequest = mockRequest(
      loadSurveyByIdSpy.surveyModel.answers[0].answerId
    );
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(ok(saveSurveyResultSpy.surveyResultModel));
  });
});
