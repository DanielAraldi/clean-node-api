import { LoadSurveysRepository } from "./db-load-surveys-protocols";
import { DbLoadSurveys } from "./db-load-surveys";
import { mockSurveysModels, throwError } from "@/domain/tests";
import { mockLoadSurveysRepository } from "@/data/tests";
import MockDate from "mockdate";

type SutTypes = {
  sut: DbLoadSurveys;
  loadSurveysRespositoryStub: LoadSurveysRepository;
};

const makeSut = (): SutTypes => {
  const loadSurveysRespositoryStub = mockLoadSurveysRepository();
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
    expect(surveys).toEqual(mockSurveysModels());
  });

  test("Should throw if LoadSurveysRepository throws", async () => {
    const { sut, loadSurveysRespositoryStub } = makeSut();
    jest
      .spyOn(loadSurveysRespositoryStub, "loadAll")
      .mockImplementationOnce(throwError);
    const promise = sut.load();
    await expect(promise).rejects.toThrow();
  });
});
