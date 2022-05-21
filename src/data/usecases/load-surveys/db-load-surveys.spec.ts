import { SurveyModel } from "../../../domain/models/survey";
import { LoadSurveysRepository } from "../../protocols/db/survey/load-surveys-repository";
import { DbLoadSurveys } from "./db-load-surveys";

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

interface SutTypes {
  sut: DbLoadSurveys;
  loadSurveysRespositoryStub: LoadSurveysRepository;
}

const makeLoadSurveysRepository = (): LoadSurveysRepository => {
  class LoadSurveysRepositoryStub implements LoadSurveysRepository {
    async loadAll(): Promise<SurveyModel[]> {
      return new Promise((resolve) => resolve(makeFakeSurveys()));
    }
  }
  return new LoadSurveysRepositoryStub();
};

const makeSut = (): SutTypes => {
  const loadSurveysRespositoryStub = makeLoadSurveysRepository();
  const sut = new DbLoadSurveys(loadSurveysRespositoryStub);
  return {
    sut,
    loadSurveysRespositoryStub,
  };
};

describe("DbLoadSurveys", () => {
  test("Should call LoadSurveysRepository", async () => {
    const { sut, loadSurveysRespositoryStub } = makeSut();
    const loadAllSpy = jest.spyOn(loadSurveysRespositoryStub, "loadAll");
    await sut.load();
    expect(loadAllSpy).toHaveBeenCalled();
  });
});
