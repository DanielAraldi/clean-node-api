export class QueryBuilder {
  private readonly query = [];

  builder(step: string, data: object): QueryBuilder {
    this.query.push({
      [step]: data,
    });
    return this;
  }

  build(): object[] {
    return this.query;
  }
}
