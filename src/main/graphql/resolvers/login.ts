import { adaptResolver } from '@/main/adapters';
import {
  makeLoginController,
  makeRefreshTokenController,
  makeSignUpController,
} from '@/main/factories';

export default {
  Query: {
    login: async (parent: any, args: any) =>
      await adaptResolver(makeLoginController(), args),
  },

  Mutation: {
    signUp: async (parent: any, args: any) =>
      await adaptResolver(makeSignUpController(), args),
    refresh: async (parent: any, args: any) =>
      await adaptResolver(makeRefreshTokenController(), args),
  },
};
