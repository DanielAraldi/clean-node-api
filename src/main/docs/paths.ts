import {
  loginPath,
  signUpPath,
  refreshTokenPath,
  surveyPath,
  surveyResultPath,
} from './paths/';

// API routes
export default {
  '/login': loginPath,
  '/signup': signUpPath,
  '/refresh': refreshTokenPath,
  '/surveys': surveyPath,
  '/surveys/{surveyId}/results': surveyResultPath,
};
