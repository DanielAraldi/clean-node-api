import { apiKeyAuthSchema } from './schemas/';
import {
  badRequest,
  forbidden,
  notFound,
  serverError,
  unanthorized,
} from './components/';

export default {
  securitySchemes: {
    apiKeyAuth: apiKeyAuthSchema,
  },
  badRequest,
  serverError,
  unanthorized,
  notFound,
  forbidden,
};
