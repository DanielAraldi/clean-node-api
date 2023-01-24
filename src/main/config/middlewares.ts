import { Express } from 'express';
import { bodyParser, contentType, cors, headers } from '@/main/middlewares';

export default (app: Express): void => {
  headers(app);
  app.use(bodyParser as Express);
  app.use(cors);
  app.use(contentType);
};
