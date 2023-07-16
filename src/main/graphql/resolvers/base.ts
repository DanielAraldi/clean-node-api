import { GraphQLScalarType } from 'graphql';

const DateTimeScalar = new GraphQLScalarType({
  name: 'DateTime',
  description: 'GraphQL ISO DateTime',
  serialize(value: string) {
    const timeAsNumber = Number(value);
    return new Date(timeAsNumber).toISOString();
  },
});

const VoidScaller = new GraphQLScalarType({
  name: 'Void',
  description: 'Use null to represents void',
  serialize: () => null,
  parseLiteral: () => null,
  parseValue: () => null,
});

export default {
  DateTime: DateTimeScalar,
  Void: VoidScaller,
};
