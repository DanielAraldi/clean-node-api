import { Collection, MongoClient, ObjectId } from "mongodb";

export const MongoHelper = {
  client: null as MongoClient,
  uri: null as string,

  async connect(uri: string): Promise<void> {
    this.uri = uri;
    this.client = await MongoClient.connect(uri);
  },

  async disconnect(): Promise<void> {
    await this.client.close();
    this.client = null;
  },

  async getCollection(name: string): Promise<Collection> {
    if (!this.client) {
      await MongoHelper.connect(this.uri);
    }
    return this.client.db().collection(name);
  },

  assign: <T>(collection: any): T => {
    const { _id, ...collectionWithoutId } = collection;
    return Object.assign({}, collectionWithoutId, { id: _id });
  },

  toObjectId: (id: string): ObjectId => new ObjectId(id),

  map: <T>(collections: any[]): T[] =>
    collections.map((collection) => MongoHelper.assign<T>(collection)),
};
