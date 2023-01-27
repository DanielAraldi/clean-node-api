import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { RequestHandler } from 'express';

export const apolloExpress = (server: ApolloServer): RequestHandler => {
  return expressMiddleware(server, {
    context: async ({ req }) => ({ req }),
  });
};
