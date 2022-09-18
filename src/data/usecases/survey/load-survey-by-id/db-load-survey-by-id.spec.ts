import { DbLoadSurveyById } from "./db-load-survey-by-id";
import { LoadSurveyByIdRepository } from "./db-load-survey-by-id-protocols";
import { mockSurveyModel, throwError } from "@/domain/tests";
import { mockLoadSurveyByIdRepository } from "@/data/tests";
import MockDate from "mockdate";

type SutTypes = {
  sut: DbLoadSurveyById;
  loadSurveyByIdRespositoryStub: LoadSurveyByIdRepository;
};

const makeSut = (): SutTypes => {
  const loadSurveyByIdRespositoryStub = mockLoadSurveyByIdRepository();
  const sut = new DbLoadSurveyById(loadSurveyByIdRespositoryStub);
  return {
    sut,
    loadSurveyByIdRespositoryStub,
  };
};

describe("DbLoadSurveyById Usecase", () => {
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
    expect(survey).toEqual(mockSurveyModel());
  });

  test("Should throw if LoadSurveyByIdRepository throws", async () => {
    const { sut, loadSurveyByIdRespositoryStub } = makeSut();
    jest
      .spyOn(loadSurveyByIdRespositoryStub, "loadById")
      .mockImplementationOnce(throwError);
    const promise = sut.loadById("any_id");
    await expect(promise).rejects.toThrow();
  });
});
