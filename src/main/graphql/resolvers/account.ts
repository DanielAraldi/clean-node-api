import { adaptResolver } from '@/main/adapters';
import { makeEditAccountController } from '@/main/factories';

export default {
  Mutation: {
    edit: async (parent: any, args: any, context: any) =>
      await adaptResolver(makeEditAccountController(), args, context),
  },
};
