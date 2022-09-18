import { DbSaveSurveyResult } from "./db-save-survey-result";
import { SaveSurveyResultRepository } from "./db-save-survey-result-protocols";
import {
  throwError,
  mockSaveSurveyResultModel,
  mockSaveSurveyResultParams,
} from "@/domain/tests";
import { mockSaveSurveyResultRepository } from "@/data/tests";
import MockDate from "mockdate";

type SutTypes = {
  sut: DbSaveSurveyResult;
  saveSurveyResultRepositoryStub: SaveSurveyResultRepository;
};

const makeSut = (): SutTypes => {
  const saveSurveyResultRepositoryStub = mockSaveSurveyResultRepository();
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
    const surveyResultData = mockSaveSurveyResultParams();
    await sut.save(surveyResultData);
    expect(saveSpy).toHaveBeenCalledWith(surveyResultData);
  });

  test("Should throw if SaveSurveyResultRepository throws", async () => {
    const { saveSurveyResultRepositoryStub, sut } = makeSut();
    jest
      .spyOn(saveSurveyResultRepositoryStub, "save")
      .mockImplementationOnce(throwError);
    const promise = sut.save(mockSaveSurveyResultParams());
    await expect(promise).rejects.toThrow();
  });

  test("Should return SurveyResult on success", async () => {
    const { sut } = makeSut();
    const surveyResult = await sut.save(mockSaveSurveyResultParams());
    expect(surveyResult).toEqual(mockSaveSurveyResultModel());
  });
});
