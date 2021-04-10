import { MongoHelper } from "../helpers/mongodb-helper";
import { AccountMongoRepository } from "./account";

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
    const accountCollection = MongoHelper.getCollection("accounts");
    await accountCollection.deleteMany({}); // Delete all register of the table
  });

  const makeSut = (): AccountMongoRepository => new AccountMongoRepository();

  test("Should return an account on success", async () => {
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
});
