import express, { Express } from 'express';
import { resolve } from 'path';
import { headers } from '@/main/middlewares';

export default (app: Express): void => {
  headers(app);
  app.use('/static', express.static(resolve(__dirname, '../../static')));
};
