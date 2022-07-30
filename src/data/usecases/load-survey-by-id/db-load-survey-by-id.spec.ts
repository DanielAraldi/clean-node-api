import { SurveyModel } from "@/domain/models/survey";
import { LoadSurveyByIdRepository } from "@/data/protocols/db/survey/load-survey-by-id-repository";
import { DbLoadSurveyById } from "./db-load-survey-by-id";
import MockDate from "mockdate";

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

const makeLoadSurveyByIdRepository = (): LoadSurveyByIdRepository => {
  class LoadSurveyByIdRepositoryStub implements LoadSurveyByIdRepository {
    async loadById(id: string): Promise<SurveyModel | null> {
      return new Promise((resolve) => resolve(makeFakeSurvey()));
    }
  }
  return new LoadSurveyByIdRepositoryStub();
};

type SutTypes = {
  sut: DbLoadSurveyById;
  loadSurveyByIdRespositoryStub: LoadSurveyByIdRepository;
};

const makeSut = (): SutTypes => {
  const loadSurveyByIdRespositoryStub = makeLoadSurveyByIdRepository();
  const sut = new DbLoadSurveyById(loadSurveyByIdRespositoryStub);
  return {
    sut,
    loadSurveyByIdRespositoryStub,
  };
};

describe("DbLoadSurveyById", () => {
  beforeAll(() => MockDate.set(new Date()));

  afterAll(() => MockDate.reset());

  test("Should call LoadSurveyByIdRepository", async () => {
    const { sut, loadSurveyByIdRespositoryStub } = makeSut();
    const loadByIdSpy = jest.spyOn(loadSurveyByIdRespositoryStub, "loadById");
    await sut.loadById("any_id");
    expect(loadByIdSpy).toHaveBeenCalledWith("any_id");
  });

  test("Should return Survey on success", async () => {
    const { sut } = makeSut();
    const survey = await sut.loadById("any_id");
    expect(survey).toEqual(makeFakeSurvey());
  });

  test("Should throw if LoadSurveyByIdRepository throws", async () => {
    const { sut, loadSurveyByIdRespositoryStub } = makeSut();
    jest
      .spyOn(loadSurveyByIdRespositoryStub, "loadById")
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error()))
      );
    const promise = sut.loadById("any_id");
    await expect(promise).rejects.toThrow();
  });
});
