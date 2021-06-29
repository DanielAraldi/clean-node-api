import { LogErrorRepository } from "../../../../data/protocols/db/log/log-error-repository";
import { MongoHelper } from "../helpers/mongodb-helper";

export class LogMongoRepository implements LogErrorRepository {
  async logError(stack: string): Promise<void> {
    const errorCollection = await MongoHelper.getCollection("errors");
    errorCollection.insertOne({
      stack,
      data: new Date(),
    });
  }
}
