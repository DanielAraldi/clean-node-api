import { loginPath, signUpPath, surveyPath, surveyResultPath } from './paths/';

// API routes
export default {
  '/login': loginPath,
  '/signup': signUpPath,
  '/surveys': surveyPath,
  '/surveys/{surveyId}/results': surveyResultPath,
};
