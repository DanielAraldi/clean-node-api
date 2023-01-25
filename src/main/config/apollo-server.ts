import { Express } from 'express';
import { ApolloServer } from '@apollo/server';
import { GraphQLError } from 'graphql';
import { apolloExpress, headers } from '@/main/middlewares';
import { pluginDrainHttpServer } from '../graphql/plugins';
import typeDefs from '../graphql/type-defs';
import resolvers from '../graphql/resolvers';

const handleErrors = (response: any, errors: readonly GraphQLError[]): void => {
  errors?.forEach(error => {
    if (checkError(error, 'BAD_REQUEST')) {
      response.http.status = 400;
    } else if (checkError(error, 'UNAUTHENTICATED')) {
      response.http.status = 401;
    } else if (checkError(error, 'FORBIDDEN')) {
      response.http.status = 403;
    } else {
      response.http.status = 500;
    }
  });
};

const checkError = (error: GraphQLError, errorName: string): boolean => {
  return error.extensions.code === errorName;
};

export default (app: Express): void => {
  headers(app);
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    plugins: [
      pluginDrainHttpServer(app),
      {
        requestDidStart: async () => ({
          willSendResponse: async ({ response, errors }) => {
            handleErrors(response, errors);
          },
        }),
      },
    ],
  });
  server
    .start()
    .then(() => app.use('/graphql', apolloExpress(server)))
    .catch(console.error);
};
