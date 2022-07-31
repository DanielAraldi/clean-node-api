import { MongoHelper } from "@/infra/db/mongodb/helpers/mongodb-helper";
import env from "@/main/config/env";
import app from "@/main/config/app";
import { sign } from "jsonwebtoken";
import { Collection } from "mongodb";
import request from "supertest";

let surveyCollection: Collection;
let accountCollection: Collection;

const makeSurveyId = async (): Promise<string> => {
  const survey = await surveyCollection.insertOne({
    question: "Question",
    answers: [
      {
        answer: "Answer 1",
        image: "http://image-name.com",
      },
    ],
    date: new Date(),
  });
  return survey.insertedId.toString();
};

const makeAccessToken = async (): Promise<string> => {
  const account = await accountCollection.insertOne({
    name: "Daniel",
    email: "daniel@gmail.com",
    password: "123",
  });
  const id = account.insertedId;
  const accessToken = sign({ id }, env.jwtSecret);
  await accountCollection.updateOne({ _id: id }, { $set: { accessToken } });
  return accessToken;
};

describe("SurveyResult Routes", () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL || "");
  });

  afterAll(async () => {
    await MongoHelper.disconnect();
  });

  beforeEach(async () => {
    surveyCollection = await MongoHelper.getCollection("surveys");
    await surveyCollection.deleteMany({});
    accountCollection = await MongoHelper.getCollection("accounts");
    await accountCollection.deleteMany({});
  });

  describe("PUT /surveys/:surveyId/results", () => {
    test("Should return 403 on save survey result without accessToken", async () =>
      await request(app)
        .put("/api/surveys/any_id/results")
        .send({
          answer: "Answer 1",
        })
        .expect(403));

    test("Should return 200 on save survey result with accessToken", async () => {
      const surveyId = await makeSurveyId();
      const accessToken = await makeAccessToken();
      await request(app)
        .put(`/api/surveys/${surveyId}/results`)
        .set("x-access-token", accessToken)
        .send({
          answer: "Answer 1",
        })
        .expect(200);
    });
  });
});
