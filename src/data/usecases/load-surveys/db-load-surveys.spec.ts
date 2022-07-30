import {
  LoadSurveysRepository,
  SurveyModel,
} from "./db-load-surveys-protocols";
import { DbLoadSurveys } from "./db-load-surveys";
import MockDate from "mockdate";

const makeFakeSurveys = (): SurveyModel[] => [
  {
    id: "any_id",
    question: "any_question",
    answers: [
      {
        image: "any_image",
        answer: "any_answer",
      },
    ],
    date: new Date(),
  },
  {
    id: "other_id",
    question: "other_question",
    answers: [
      {
        image: "other_image",
        answer: "other_answer",
      },
    ],
    date: new Date(),
  },
];

const makeLoadSurveysRepository = (): LoadSurveysRepository => {
  class LoadSurveysRepositoryStub implements LoadSurveysRepository {
    async loadAll(): Promise<SurveyModel[]> {
      return new Promise((resolve) => resolve(makeFakeSurveys()));
    }
  }
  return new LoadSurveysRepositoryStub();
};

type SutTypes = {
  sut: DbLoadSurveys;
  loadSurveysRespositoryStub: LoadSurveysRepository;
};

const makeSut = (): SutTypes => {
  const loadSurveysRespositoryStub = makeLoadSurveysRepository();
  const sut = new DbLoadSurveys(loadSurveysRespositoryStub);
  return {
    sut,
    loadSurveysRespositoryStub,
  };
};

describe("DbLoadSurveys Usecase", () => {
  beforeAll(() => MockDate.set(new Date()));

  afterAll(() => MockDate.reset());

  test("Should call LoadSurveysRepository", async () => {
    const { sut, loadSurveysRespositoryStub } = makeSut();
    const loadAllSpy = jest.spyOn(loadSurveysRespositoryStub, "loadAll");
    await sut.load();
    expect(loadAllSpy).toHaveBeenCalled();
  });

  test("Should return a list of survey on success", async () => {
    const { sut } = makeSut();
    const surveys = await sut.load();
    expect(surveys).toEqual(makeFakeSurveys());
  });

  test("Should throw if LoadSurveysRepository throws", async () => {
    const { sut, loadSurveysRespositoryStub } = makeSut();
    jest
      .spyOn(loadSurveysRespositoryStub, "loadAll")
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error()))
      );
    const promise = sut.load();
    await expect(promise).rejects.toThrow();
  });
});
