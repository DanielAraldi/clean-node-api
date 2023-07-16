import { adaptRoute } from '@/main/adapters';
import { makeEditAccountController } from '@/main/factories';
import { auth } from '@/main/middlewares';
import { Router } from 'express';

export default (router: Router): void => {
  router.put('/account/edit', auth, adaptRoute(makeEditAccountController()));
};
