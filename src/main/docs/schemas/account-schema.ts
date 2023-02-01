export const accountSchema = {
  type: 'object',
  properties: {
    accessToken: { type: 'string' },
    name: { type: 'string' },
  },
  required: ['accessToken', 'name'],
  example: {
    accessToken: 'any_access_token',
    name: 'any_name',
  },
};
