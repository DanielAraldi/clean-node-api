export const refreshTokenParamsSchema = {
  type: 'object',
  properties: {
    accessToken: { type: 'string' },
  },
  required: ['accessToken'],
  example: {
    accessToken: 'any_access_token',
  },
};
