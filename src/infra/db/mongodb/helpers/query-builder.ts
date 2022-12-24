export class QueryBuilder {
  private readonly query = [];

  builder(property: string, data: object): QueryBuilder {
    this.query.push({
      [property]: data,
    });
    return this;
  }

  build(): object[] {
    return this.query;
  }
}
