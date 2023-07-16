import {
  accountPath,
  loginPath,
  signUpPath,
  refreshTokenPath,
  surveyPath,
  surveyResultPath,
} from './paths/';

export default {
  '/account/edit': accountPath,
  '/login': loginPath,
  '/signup': signUpPath,
  '/refresh': refreshTokenPath,
  '/surveys': surveyPath,
  '/surveys/{surveyId}/results': surveyResultPath,
};
