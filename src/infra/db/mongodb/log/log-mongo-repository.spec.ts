import { Collection } from "mongodb";
import { MongoHelper } from "../helpers/mongodb-helper";
import { LogMongoRepository } from "./log-mongo-repository";

const makeSut = (): LogMongoRepository => new LogMongoRepository();

describe("Log Mongo Repository", () => {
  let errorCollection: Collection;

  beforeAll(async () => {
    // Before all tests connect to mongodb
    await MongoHelper.connect(process.env.MONGO_URL);
  });

  afterAll(async () => {
    // After all tests disconnect to mongodb
    await MongoHelper.disconnect();
  });

  beforeEach(async () => {
    errorCollection = await MongoHelper.getCollection("errors");
    await errorCollection.deleteMany({}); // Delete all register of the table
  });

  test("Should create an error log on success", async () => {
    const sut = makeSut();
    await sut.logError("any_error");
    // Returns the amount of data in a database
    const count = await errorCollection.countDocuments();
    expect(count).toBe(1);
  });
});
