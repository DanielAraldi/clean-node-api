import {
  makeSaveSurveyResultController,
  makeLoadSurveyResultController,
} from '@/main/factories';
import { adaptRoute } from '@/main/adapters';
import { auth } from '@/main/middlewares';
import { Router } from 'express';

export default (router: Router): void => {
  router.get(
    '/surveys/:surveyId/results',
    auth,
    adaptRoute(makeLoadSurveyResultController())
  );
  router.put(
    '/surveys/:surveyId/results',
    auth,
    adaptRoute(makeSaveSurveyResultController())
  );
};
