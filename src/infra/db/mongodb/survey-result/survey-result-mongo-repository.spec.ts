import {
  SurveyModel,
  AccountModel,
} from "./survey-result-mongo-repository-protocols";
import { MongoHelper } from "../helpers/mongodb-helper";
import { SurveyResultMongoRepository } from "./survey-result-mongo-repository";
import { Collection } from "mongodb";

let surveyCollection: Collection;
let surveyResultCollection: Collection;
let accountCollection: Collection;

const makeAccount = async (): Promise<AccountModel> => {
  const insertedAccount = await accountCollection.insertOne({
    name: "any_name",
    email: "any_email@mail.com",
    password: "any_password",
  });
  const account = await accountCollection.findOne({
    _id: insertedAccount.insertedId,
  });
  return MongoHelper.assign<AccountModel>(account);
};

const makeSurvey = async (): Promise<SurveyModel> => {
  const insertedSurvey = await surveyCollection.insertOne({
    question: "any_question",
    answers: [
      {
        image: "any_image",
        answer: "any_answer",
      },
      {
        answer: "other_answer",
      },
    ],
    date: new Date(),
  });
  const survey = await surveyCollection.findOne({
    _id: insertedSurvey.insertedId,
  });
  return MongoHelper.assign<SurveyModel>(survey);
};

const makeSut = (): SurveyResultMongoRepository =>
  new SurveyResultMongoRepository();

describe("Survey Mongo Repository", () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL || "");
  });

  afterAll(async () => {
    await MongoHelper.disconnect();
  });

  beforeEach(async () => {
    surveyCollection = await MongoHelper.getCollection("surveys");
    await surveyCollection.deleteMany({});
    surveyResultCollection = await MongoHelper.getCollection("surveyResults");
    await surveyResultCollection.deleteMany({});
    accountCollection = await MongoHelper.getCollection("accounts");
    await accountCollection.deleteMany({});
  });

  describe("save()", () => {
    test("Should add a survey result if its new", async () => {
      const sut = makeSut();
      const survey = await makeSurvey();
      const account = await makeAccount();
      const surveyResult = await sut.save({
        surveyId: survey.id,
        accountId: account.id,
        answer: survey.answers[0].answer,
        date: new Date(),
      });
      expect(surveyResult).toBeTruthy();
      expect(surveyResult.id).toBeTruthy();
      expect(surveyResult.answer).toBe(survey.answers[0].answer);
    });

    test("Should update survey result if its not new", async () => {
      const sut = makeSut();
      const survey = await makeSurvey();
      const account = await makeAccount();
      const insertedSurveyResult = await surveyResultCollection.insertOne({
        surveyId: survey.id,
        accountId: account.id,
        answer: survey.answers[0].answer,
        date: new Date(),
      });
      const surveyResult = await sut.save({
        surveyId: survey.id,
        accountId: account.id,
        answer: survey.answers[1].answer,
        date: new Date(),
      });
      expect(surveyResult).toBeTruthy();
      expect(surveyResult.id).toEqual(insertedSurveyResult.insertedId);
      expect(surveyResult.answer).toBe(survey.answers[1].answer);
    });
  });
});
