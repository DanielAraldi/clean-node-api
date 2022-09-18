import { DbSaveSurveyResult } from "./db-save-survey-result";
import {
  SaveSurveyResultParams,
  SurveyResultModel,
  SaveSurveyResultRepository,
} from "./db-save-survey-result-protocols";
import MockDate from "mockdate";
import { throwError } from "@/domain/tests";

const makeFakeSurveyResultData = (): SaveSurveyResultParams => ({
  accountId: "any_account_id",
  surveyId: "any_survey_id",
  answerId: "any_answer_id",
  date: new Date(),
});

const makeFakeSurveyResult = (): SurveyResultModel =>
  Object.assign({}, makeFakeSurveyResultData(), { id: "any_id" });

type SutTypes = {
  sut: DbSaveSurveyResult;
  saveSurveyResultRepositoryStub: SaveSurveyResultRepository;
};

const makeSaveSurveyResultRepository = (): SaveSurveyResultRepository => {
  class SaveSurveyResultRepositoryStub implements SaveSurveyResultRepository {
    async save(data: SaveSurveyResultParams): Promise<SurveyResultModel> {
      return new Promise((resolve) => resolve(makeFakeSurveyResult()));
    }
  }
  return new SaveSurveyResultRepositoryStub();
};

const makeSut = (): SutTypes => {
  const saveSurveyResultRepositoryStub = makeSaveSurveyResultRepository();
  const sut = new DbSaveSurveyResult(saveSurveyResultRepositoryStub);
  return {
    sut,
    saveSurveyResultRepositoryStub,
  };
};

describe("DbSaveSurveyResult Usecase", () => {
  beforeAll(() => MockDate.set(new Date()));

  afterAll(() => MockDate.reset());

  test("Should call SaveSurveyResultRepository with correct values", async () => {
    const { saveSurveyResultRepositoryStub, sut } = makeSut();
    const saveSpy = jest.spyOn(saveSurveyResultRepositoryStub, "save");
    const surveyResultData = makeFakeSurveyResultData();
    await sut.save(surveyResultData);
    expect(saveSpy).toHaveBeenCalledWith(surveyResultData);
  });

  test("Should throw if SaveSurveyResultRepository throws", async () => {
    const { saveSurveyResultRepositoryStub, sut } = makeSut();
    jest
      .spyOn(saveSurveyResultRepositoryStub, "save")
      .mockImplementationOnce(throwError);
    const promise = sut.save(makeFakeSurveyResultData());
    await expect(promise).rejects.toThrow();
  });

  test("Should return SurveyResult on success", async () => {
    const { sut } = makeSut();
    const surveyResult = await sut.save(makeFakeSurveyResultData());
    expect(surveyResult).toEqual(makeFakeSurveyResult());
  });
});
