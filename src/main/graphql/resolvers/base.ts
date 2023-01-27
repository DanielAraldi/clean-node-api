import { GraphQLScalarType } from 'graphql';

const DateTimeScalar = new GraphQLScalarType({
  name: 'DateTime',
  description: 'GraphQL ISO DateTime',
  serialize(value: string) {
    const timeAsNumber = Number(value);
    return new Date(timeAsNumber).toISOString();
  },
});

export default {
  DateTime: DateTimeScalar,
};
