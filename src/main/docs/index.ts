import { loginPath, surveyPath, signUpPath, surveyResultPath } from './paths';
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
  signUpParamsSchema,
  addSurveyAnswerSchema,
  addSurveyParamsSchema,
  saveSurveyParamsSchema,
  surveyResultSchema,
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
    '/signup': signUpPath,
    '/surveys': surveyPath,
    '/surveys/{surveyId}/results': surveyResultPath,
  },
  schemas: {
    account: accountSchema,
    loginParams: loginParamsSchema,
    signUpParams: signUpParamsSchema,
    error: errorSchema,
    survey: surveySchema,
    surveys: surveysSchema,
    surveyAnswer: surveyAnswerSchema,
    addSurveyAnswer: addSurveyAnswerSchema,
    addSurveyParams: addSurveyParamsSchema,
    saveSurveyParams: saveSurveyParamsSchema,
    surveyResult: surveyResultSchema,
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
