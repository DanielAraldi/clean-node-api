import { adaptResolver, adaptResolverMiddleware } from '@/main/adapters';
import {
  makeAuthMiddleware,
  makeLoadSurveysController,
} from '@/main/factories';

export default {
  Query: {
    surveys: async (parent: any, args: any, context: any) => {
      const contextMiddleware = await adaptResolverMiddleware(
        makeAuthMiddleware(),
        context
      );
      return await adaptResolver(
        makeLoadSurveysController(),
        args,
        contextMiddleware
      );
    },
  },
};
