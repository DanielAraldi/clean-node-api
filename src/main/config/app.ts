import express from 'express';
import setupMiddlewares from './middlewares';
import setupSwagger from './swagger';
import setupRoutes from './routes';
import setupStaticFiles from './static-files';
import { setupApolloServer } from '../graphql/apollo/apollo-server';

const app = express();
setupApolloServer(app);
setupStaticFiles(app);
setupSwagger(app);
setupMiddlewares(app);
setupRoutes(app);
export default app;
