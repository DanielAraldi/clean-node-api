import { adaptResolver, adaptResolverMiddleware } from '@/main/adapters';
import {
  makeAuthMiddleware,
  makeLoadSurveyResultController,
  makeSaveSurveyResultController,
} from '@/main/factories';

export default {
  Query: {
    surveyResult: async (parent: any, args: any, context: any) => {
      await adaptResolverMiddleware(makeAuthMiddleware(), context);
      return await adaptResolver(makeLoadSurveyResultController(), args);
    },
  },

  Mutation: {
    saveSurveyResult: async (parent: any, args: any, context: any) => {
      await adaptResolverMiddleware(makeAuthMiddleware(), context);
      return await adaptResolver(makeSaveSurveyResultController(), args);
    },
  },
};
