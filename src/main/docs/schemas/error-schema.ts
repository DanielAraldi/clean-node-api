export const errorSchema = {
  type: 'object',
  properties: {
    error: { type: 'string' },
  },
  required: ['error'],
  example: {
    error: 'any_error',
  },
};
