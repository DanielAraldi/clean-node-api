export const loginParamsSchema = {
  type: 'object',
  properties: {
    email: { type: 'string' },
    password: { type: 'string' },
  },
  required: ['email', 'password'],
  example: {
    email: 'any_email@gmail.com',
    password: 'any_password',
  },
};
