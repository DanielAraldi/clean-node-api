import { loginPath, surveyPath } from './paths';
import {
  badRequest,
  serverError,
  unanthorized,
  notFound,
  forbidden,
} from './components';
import {
  loginParamsSchema,
  errorSchema,
  accountSchema,
  surveyAnswerSchema,
  surveySchema,
  surveysSchema,
  apiKeyAuthSchema,
} from './schemas';

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
  tags: [{ name: 'Login' }, { name: 'Survey' }], // Query titles
  paths: {
    // API routes
    '/login': loginPath,
    '/surveys': surveyPath,
  },
  schemas: {
    account: accountSchema,
    loginParams: loginParamsSchema,
    error: errorSchema,
    survey: surveySchema,
    surveys: surveysSchema,
    surveyAnswer: surveyAnswerSchema,
  },
  components: {
    securitySchemes: {
      apiKeyAuth: apiKeyAuthSchema,
    },
    badRequest,
    serverError,
    unanthorized,
    notFound,
    forbidden,
  },
};
