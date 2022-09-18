import {
  AddSurveyParams,
  AddSurveyRepository,
} from "./db-add-survey-protocols";
import { DbAddSurvey } from "./db-add-survey";
import { throwError } from "@/domain/tests";
import { mockAddSurveyRepository } from "@/data/tests";
import MockDate from "mockdate";

const makeFakeSurveyData = (): AddSurveyParams => ({
  question: "any_question",
  answers: [
    {
      image: "any_image",
      answer: "any_answer",
    },
  ],
  date: new Date(),
});

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
    const surveyData = makeFakeSurveyData();
    await sut.add(surveyData);
    expect(addSpy).toHaveBeenCalledWith(surveyData);
  });

  test("Should throw if AddSurveyRepository throws", async () => {
    const { addSurveyRepositoryStub, sut } = makeSut();
    jest
      .spyOn(addSurveyRepositoryStub, "add")
      .mockImplementationOnce(throwError);
    const promise = sut.add(makeFakeSurveyData());
    await expect(promise).rejects.toThrow();
  });
});
