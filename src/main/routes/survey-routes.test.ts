import { MongoHelper } from "@/infra/db/mongodb/helpers/mongodb-helper";
import app from "@/main/config/app";
import env from "@/main/config/env";
import { Collection } from "mongodb";
import { sign } from "jsonwebtoken";
import request from "supertest";

let surveyCollection: Collection;
let accountCollection: Collection;

const makeAccessToken = async (): Promise<string> => {
  const account = await accountCollection.insertOne({
    name: "Daniel",
    email: "daniel@gmail.com",
    password: "123",
    role: "admin",
  });
  const id = account.insertedId;
  const accessToken = sign({ id }, env.jwtSecret);
  await accountCollection.updateOne({ _id: id }, { $set: { accessToken } });
  return accessToken;
};

describe("Survey Routes", () => {
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

  describe("POST /surveys", () => {
    test("Should return 403 on add survey without accessToken", async () =>
      await request(app)
        .post("/api/surveys")
        .send({
          question: "Question",
          answers: [
            {
              answer: "Answer 1",
              image: "http://image-name.com",
            },
            {
              answer: "Answer 2",
            },
          ],
        })
        .expect(403));

    test("Should return 204 on add survey with valid accessToken", async () => {
      const accessToken = await makeAccessToken();
      await request(app)
        .post("/api/surveys")
        .set("x-access-token", accessToken)
        .send({
          question: "Question",
          answers: [
            {
              answer: "Answer 1",
              image: "http://image-name.com",
            },
            {
              answer: "Answer 2",
            },
          ],
        })
        .expect(204);
    });
  });

  describe("GET /surveys", () => {
    test("Should return 403 on load surveys without accessToken", async () =>
      await request(app).get("/api/surveys").expect(403));

    test("Should return 204 on load no surveys with valid accessToken", async () => {
      const accessToken = await makeAccessToken();
      await request(app)
        .get("/api/surveys")
        .set("x-access-token", accessToken)
        .expect(204);
    });

    test("Should return 200 on load surveys with valid accessToken", async () => {
      const accessToken = await makeAccessToken();
      await surveyCollection.insertMany([
        {
          question: "any_question",
          answers: [
            {
              image: "any_image",
              answer: "any_answer",
            },
          ],
          date: new Date(),
        },
      ]);
      await request(app)
        .get("/api/surveys")
        .set("x-access-token", accessToken)
        .expect(200);
    });
  });
});
