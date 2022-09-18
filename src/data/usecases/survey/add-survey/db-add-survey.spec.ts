import { AddSurveyRepository } from "./db-add-survey-protocols";
import { DbAddSurvey } from "./db-add-survey";
import { throwError, mockAddSurveyParams } from "@/domain/tests";
import { mockAddSurveyRepository } from "@/data/tests";
import MockDate from "mockdate";

type SutTypes = {
  sut: DbAddSurvey;
  addSurveyRepositoryStub: AddSurveyRepository;
};

const makeSut = (): SutTypes => {
  const addSurveyRepositoryStub = mockAddSurveyRepository();
  const sut = new DbAddSurvey(addSurveyRepositoryStub);
  return {
    sut,
    addSurveyRepositoryStub,
  };
};

describe("DbAddSurvey Usecase", () => {
  beforeAll(() => MockDate.set(new Date()));

  afterAll(() => MockDate.reset());

  test("Should call AddSurveyRepository with correct values", async () => {
    const { addSurveyRepositoryStub, sut } = makeSut();
    const addSpy = jest.spyOn(addSurveyRepositoryStub, "add");
    const surveyData = mockAddSurveyParams();
    await sut.add(surveyData);
    expect(addSpy).toHaveBeenCalledWith(surveyData);
  });

  test("Should throw if AddSurveyRepository throws", async () => {
    const { addSurveyRepositoryStub, sut } = makeSut();
    jest
      .spyOn(addSurveyRepositoryStub, "add")
      .mockImplementationOnce(throwError);
    const promise = sut.add(mockAddSurveyParams());
    await expect(promise).rejects.toThrow();
  });
});
