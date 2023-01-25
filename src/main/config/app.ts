import express from 'express';
import setupMiddlewares from './middlewares';
import setupApolloServer from './apollo-server';
import setupSwagger from './swagger';
import setupRoutes from './routes';
import setupStaticFiles from './static-files';

const app = express();
setupApolloServer(app);
setupStaticFiles(app);
setupSwagger(app);
setupMiddlewares(app);
setupRoutes(app);
export default app;
