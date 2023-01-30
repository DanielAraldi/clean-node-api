import { ApolloServer } from '@apollo/server';
import typeDefs from '@/main/graphql/type-defs';
import resolvers from '@/main/graphql/resolvers';

export const makeApolloServer = (): ApolloServer =>
  new ApolloServer({
    resolvers,
    typeDefs,
  });
