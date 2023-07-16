export const accountEditParamsSchema = {
  type: 'object',
  properties: {
    email: {
      type: 'string',
      nullable: true,
    },
    name: {
      type: 'string',
      nullable: true,
    },
  },
  required: ['email', 'name'],
  example: {
    email: 'any_email@gmail.com',
    name: null,
  },
};
