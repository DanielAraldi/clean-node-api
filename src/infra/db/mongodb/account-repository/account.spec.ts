import { MongoHelper } from "../helpers/mongodb-helper";
import { AccountMongoRepository } from "./account";
import { Collection } from "mongodb";

let accountCollection: Collection;

describe("Account Mongo Repository", () => {
  beforeAll(async () => {
    // Before all tests connect to mongodb
    await MongoHelper.connect(process.env.MONGO_URL);
  });

  afterAll(async () => {
    // After all tests disconnect to mongodb
    await MongoHelper.disconnect();
  });

  beforeEach(async () => {
    accountCollection = await MongoHelper.getCollection("accounts");
    await accountCollection.deleteMany({}); // Delete all register of the table
  });

  const makeSut = (): AccountMongoRepository => new AccountMongoRepository();

  test("Should return an account on add success", async () => {
    const sut = makeSut();
    const account = await sut.add({
      name: "any_name",
      email: "any_email@mail.com",
      password: "any_password",
    });
    expect(account).toBeTruthy(); // Check if isn't undefined, null or anyone who is fake
    expect(account.id).toBeTruthy();
    expect(account.name).toBe("any_name");
    expect(account.email).toBe("any_email@mail.com");
    expect(account.password).toBe("any_password");
  });

  test("Should return an account on loadByEmail success", async () => {
    const sut = makeSut();
    await accountCollection.insertOne({
      name: "any_name",
      email: "any_email@mail.com",
      password: "any_password",
    });
    const account = await sut.loadByEmail("any_email@mail.com");
    expect(account).toBeTruthy();
    expect(account.id).toBeTruthy();
    expect(account.name).toBe("any_name");
    expect(account.email).toBe("any_email@mail.com");
    expect(account.password).toBe("any_password");
  });

  test("Should return null if loadByEmail fails", async () => {
    const sut = makeSut();
    const account = await sut.loadByEmail("any_email@mail.com");
    expect(account).toBeFalsy();
  });
});
