export const signUpParamsSchema = {
  type: 'object',
  properties: {
    name: { type: 'string' },
    email: { type: 'string' },
    password: { type: 'string' },
    passwordConfirmation: { type: 'string' },
  },
  required: ['name', 'email', 'password', 'passwordConfirmation'],
  example: {
    name: 'any_name',
    email: 'any_email@gmail.com',
    password: 'any_password',
    passwordConfirmation: 'any_password_confirmation',
  },
};
