import { Express } from 'express';
import { serve, setup } from 'swagger-ui-express';
import { headers, noCache } from '@/main/middlewares';
import swaggerConfig from '@/main/docs';

export default (app: Express): void => {
  headers(app);
  app.use('/api/docs', noCache, serve, setup(swaggerConfig));
};
