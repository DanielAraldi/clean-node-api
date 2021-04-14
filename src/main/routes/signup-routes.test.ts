import request from "supertest";
import { app } from "../config/app";
import { MongoHelper } from "../../infra/db/mongodb/helpers/mongodb-helper";

describe("SignUp Routes", () => {
  beforeAll(async () => {
    // Before all tests connect to mongodb
    await MongoHelper.connect(process.env.MONGO_URL);
  });

  afterAll(async () => {
    // After all tests disconnect to mongodb
    await MongoHelper.disconnect();
  });

  beforeEach(async () => {
    const accountCollection = MongoHelper.getCollection("accounts");
    await accountCollection.deleteMany({}); // Delete all register of the table
  });

  test("Should return an account on success", async () =>
    await request(app)
      .post("/api/signup")
      .send({
        name: "Daniel",
        email: "daniel@gmail.com",
        password: "123",
        passwordConfirmation: "123",
      })
      .expect(200));
});