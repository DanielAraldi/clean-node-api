import { SaveSurveyResultController } from "./save-survey-result-controller";
import {
  HttpRequest,
  LoadSurveyById,
  SurveyModel,
  forbidden,
  InvalidParamError,
  serverError,
  SaveSurveyResult,
  SaveSurveyResultParams,
  SurveyResultModel,
  ok,
  Validation,
  badRequest,
} from "./save-survey-result-controller-protocols";
import MockDate from "mockdate";
import { mockSurveyModel, throwError } from "@/domain/tests";

const makeFakeRequest = (): HttpRequest => ({
  body: {
    answerId: "any_answer_id",
  },
  params: {
    surveyId: "any_survey_id",
  },
  accountId: "any_account_id",
});

const makeFakeSurveyResult = (): SurveyResultModel => ({
  id: "valid_id",
  surveyId: "valid_survey_id",
  accountId: "valid_account_id",
  answerId: "valid_answer_id",
  date: new Date(),
});

const makeValidation = (): Validation => {
  class ValidationStub implements Validation {
    validate(input: any): Error | null {
      return null;
    }
  }
  return new ValidationStub();
};

const makeLoadSurveyById = (): LoadSurveyById => {
  class LoadSurveyByIdStub implements LoadSurveyById {
    async loadById(id: string): Promise<SurveyModel | null> {
      return new Promise((resolve) => resolve(mockSurveyModel()));
    }
  }
  return new LoadSurveyByIdStub();
};

const makeSaveSurveyResult = (): SaveSurveyResult => {
  class SaveSurveyResultStub implements SaveSurveyResult {
    async save(data: SaveSurveyResultParams): Promise<SurveyResultModel> {
      return new Promise((resolve) => resolve(makeFakeSurveyResult()));
    }
  }
  return new SaveSurveyResultStub();
};

type SutTypes = {
  sut: SaveSurveyResultController;
  validationStub: Validation;
  loadSurveyByIdStub: LoadSurveyById;
  saveSurveyResultStub: SaveSurveyResult;
};

const makeSut = (): SutTypes => {
  const validationStub = makeValidation();
  const loadSurveyByIdStub = makeLoadSurveyById();
  const saveSurveyResultStub = makeSaveSurveyResult();
  const sut = new SaveSurveyResultController(
    validationStub,
    loadSurveyByIdStub,
    saveSurveyResultStub
  );
  return { sut, validationStub, loadSurveyByIdStub, saveSurveyResultStub };
};

describe("SaveSurveyResult Controller", () => {
  beforeAll(() => MockDate.set(new Date()));

  afterAll(() => MockDate.reset());

  test("Should call Validation with correct values", async () => {
    const { sut, validationStub } = makeSut();
    const validateSpy = jest.spyOn(validationStub, "validate");
    const httpRequest = makeFakeRequest();
    await sut.handle(httpRequest);
    expect(validateSpy).toHaveBeenCalledWith(httpRequest.body);
  });

  test("Should return 400 if Validation fails", async () => {
    const { sut, validationStub } = makeSut();
    jest.spyOn(validationStub, "validate").mockReturnValueOnce(new Error());
    const httpResponse = await sut.handle(makeFakeRequest());
    expect(httpResponse).toEqual(badRequest(new Error()));
  });

  test("Should call LoadSurveyById with correct values", async () => {
    const { sut, loadSurveyByIdStub } = makeSut();
    const loadByIdSpy = jest.spyOn(loadSurveyByIdStub, "loadById");
    await sut.handle(makeFakeRequest());
    expect(loadByIdSpy).toHaveBeenCalledWith("any_survey_id");
  });

  test("Should return 403 if LoadSurveyById returns null", async () => {
    const { sut, loadSurveyByIdStub } = makeSut();
    jest.spyOn(loadSurveyByIdStub, "loadById").mockReturnValueOnce(null);
    const httpResponse = await sut.handle(makeFakeRequest());
    expect(httpResponse).toEqual(forbidden(new InvalidParamError("surveyId")));
  });

  test("Should return 403 if an invalid answer is provided", async () => {
    const { sut } = makeSut();
    const httpResponse = await sut.handle({
      body: {
        answerId: "wrong_answer_id",
      },
      params: {
        surveyId: "any_survey_id",
      },
    });
    expect(httpResponse).toEqual(forbidden(new InvalidParamError("answerId")));
  });

  test("Should return 500 if LoadSurveyById throws", async () => {
    const { sut, loadSurveyByIdStub } = makeSut();
    jest
      .spyOn(loadSurveyByIdStub, "loadById")
      .mockImplementationOnce(throwError);
    const httpResponse = await sut.handle(makeFakeRequest());
    expect(httpResponse).toEqual(serverError(new Error()));
  });

  test("Should call SaveSurveyResult with correct values", async () => {
    const { sut, saveSurveyResultStub } = makeSut();
    const saveSpy = jest.spyOn(saveSurveyResultStub, "save");
    await sut.handle(makeFakeRequest());
    expect(saveSpy).toHaveBeenCalledWith({
      surveyId: "any_survey_id",
      accountId: "any_account_id",
      date: new Date(),
      answerId: "any_answer_id",
    });
  });

  test("Should return 500 if SaveSurveyResult throws", async () => {
    const { sut, saveSurveyResultStub } = makeSut();
    jest.spyOn(saveSurveyResultStub, "save").mockImplementationOnce(throwError);
    const httpResponse = await sut.handle(makeFakeRequest());
    expect(httpResponse).toEqual(serverError(new Error()));
  });

  test("Should return 200 on success", async () => {
    const { sut } = makeSut();
    const httpResponse = await sut.handle(makeFakeRequest());
    expect(httpResponse).toEqual(ok(makeFakeSurveyResult()));
  });
});
