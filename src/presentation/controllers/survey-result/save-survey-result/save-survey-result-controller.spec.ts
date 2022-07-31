import { SaveSurveyResultController } from "./save-survey-result-controller";
import {
  HttpRequest,
  LoadSurveyById,
  SurveyModel,
  forbidden,
  InvalidParamError,
  serverError,
  SaveSurveyResult,
  SaveSurveyResultModel,
  SurveyResultModel,
} from "./save-survey-result-controller-protocols";
import MockDate from "mockdate";

const makeFakeRequest = (): HttpRequest => ({
  body: {
    answer: "any_answer",
  },
  params: {
    surveyId: "any_survey_id",
  },
  accountId: "any_account_id",
});

const makeFakeSurvey = (): SurveyModel => ({
  id: "any_id",
  question: "any_question",
  answers: [
    {
      image: "any_image",
      answer: "any_answer",
    },
  ],
  date: new Date(),
});

const makeFakeSurveyResult = (): SurveyResultModel => ({
  id: "valid_id",
  surveyId: "valid_survey_id",
  accountId: "valid_account_id",
  answer: "valid_answer",
  date: new Date(),
});

const makeLoadSurveyById = (): LoadSurveyById => {
  class LoadSurveyByIdStub implements LoadSurveyById {
    async loadById(id: string): Promise<SurveyModel | null> {
      return new Promise((resolve) => resolve(makeFakeSurvey()));
    }
  }
  return new LoadSurveyByIdStub();
};

const makeSaveSurveyResult = (): SaveSurveyResult => {
  class SaveSurveyResultStub implements SaveSurveyResult {
    async save(data: SaveSurveyResultModel): Promise<SurveyResultModel> {
      return new Promise((resolve) => resolve(makeFakeSurveyResult()));
    }
  }
  return new SaveSurveyResultStub();
};

type SutTypes = {
  sut: SaveSurveyResultController;
  loadSurveyByIdStub: LoadSurveyById;
  saveSurveyResultStub: SaveSurveyResult;
};

const makeSut = (): SutTypes => {
  const loadSurveyByIdStub = makeLoadSurveyById();
  const saveSurveyResultStub = makeSaveSurveyResult();
  const sut = new SaveSurveyResultController(
    loadSurveyByIdStub,
    saveSurveyResultStub
  );
  return { sut, loadSurveyByIdStub, saveSurveyResultStub };
};

describe("SaveSurveyResult Controller", () => {
  beforeAll(() => MockDate.set(new Date()));

  afterAll(() => MockDate.reset());

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
        answer: "wrong_answer",
      },
      params: {
        surveyId: "any_survey_id",
      },
    });
    expect(httpResponse).toEqual(forbidden(new InvalidParamError("answer")));
  });

  test("Should return 500 if LoadSurveyById throws", async () => {
    const { sut, loadSurveyByIdStub } = makeSut();
    jest
      .spyOn(loadSurveyByIdStub, "loadById")
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error()))
      );
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
      answer: "any_answer",
    });
  });

  test("Should return 500 if SaveSurveyResult throws", async () => {
    const { sut, saveSurveyResultStub } = makeSut();
    jest
      .spyOn(saveSurveyResultStub, "save")
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error()))
      );
    const httpResponse = await sut.handle(makeFakeRequest());
    expect(httpResponse).toEqual(serverError(new Error()));
  });
});
