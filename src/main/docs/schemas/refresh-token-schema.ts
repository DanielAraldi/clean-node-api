export const refreshTokenSchema = {
  type: 'object',
  properties: {
    accessToken: { type: 'string' },
  },
  required: ['accessToken'],
  example: {
    accessToken: 'any_access_token',
  },
};
