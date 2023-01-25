import { Express } from 'express';
import { apolloExpress, headers } from '@/main/middlewares';
import { ApolloServer } from '@apollo/server';
import { pluginDrainHttpServer } from '../graphql/plugins';
import typeDefs from '../graphql/type-defs';
import resolvers from '../graphql/resolvers';

export default (app: Express): void => {
  headers(app);
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    plugins: [pluginDrainHttpServer(app)],
  });
  server
    .start()
    .then(() => app.use('/graphql', apolloExpress(server)))
    .catch(console.error);
};
