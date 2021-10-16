import { Express } from 'express'

export const headers = (app: Express): void => {
  app.disable('x-powered-by')
}
