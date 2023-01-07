import express from 'express';
import setupMiddlewares from './middlewares';
import setupSwagger from './config-swagger';
import setupRoutes from './routes';
import setupStaticFiles from './static-files';

const app = express();
setupStaticFiles(app);
setupSwagger(app);
setupMiddlewares(app);
setupRoutes(app);
export default app;
