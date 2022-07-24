import { MongoHelper } from "../helpers/mongodb-helper";
import { LogErrorRepository } from "./log-mongo-repository-protocols";

export class LogMongoRepository implements LogErrorRepository {
  async logError(stack: string): Promise<void> {
    const errorCollection = await MongoHelper.getCollection("errors");
    await errorCollection.insertOne({
      stack,
      data: new Date(),
    });
  }
}
