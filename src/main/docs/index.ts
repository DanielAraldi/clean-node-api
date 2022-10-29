import { loginPath } from './paths';
import { badRequest, serverError, unanthorized, notFound } from './components';
import { loginParamsSchema, errorSchema, accountSchema } from './schemas';

export default {
  openapi: '3.0.0', // API version
  info: {
    title: 'Clean Node API',
    description:
      'API of surveys in NodeJs using Typescript, TDD, Clean Architecture, Design Patterns and SOLID principles.',
    version: '1.0.0', // Documentation version
  },
  contact: {
    name: 'Daniel Sansão Araldi',
    url: 'https://github.com/DanielAraldi/clean-node-api/issues',
  },
  license: {
    name: 'MIT',
    url: 'https://github.com/DanielAraldi/clean-node-api/blob/main/LICENSE',
  },
  servers: [{ url: '/api' }], // Paths URL
  tags: [{ name: 'Login' }], // Query titles
  paths: {
    // API routes
    '/login': loginPath,
  },
  schemas: {
    account: accountSchema,
    loginParams: loginParamsSchema,
    error: errorSchema,
  },
  components: { badRequest, serverError, unanthorized, notFound },
};
