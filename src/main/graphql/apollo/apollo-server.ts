import { Express } from 'express';
import { ApolloServer } from '@apollo/server';
import { GraphQLError } from 'graphql';
import { apolloExpress, headers } from '@/main/middlewares';
import { pluginDrainHttpServer } from '@/main/graphql/plugins';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { authDirectiveTransformer } from '@/main/graphql/directives';
import typeDefs from '@/main/graphql/type-defs';
import resolvers from '@/main/graphql/resolvers';

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

const checkError = (error: GraphQLError, errorName: string): boolean =>
  error.extensions.code === errorName;

let schema = makeExecutableSchema({ resolvers, typeDefs });
schema = authDirectiveTransformer(schema);

export const setupApolloServer = (app: Express): void => {
  headers(app);
  const server = new ApolloServer({
    schema,
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
    .then(() => app.use('/api/graphql', apolloExpress(server)))
    .catch(console.error);
};
