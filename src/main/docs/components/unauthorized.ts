export const unanthorized = {
  description: 'Invalid Credentials!',
  content: {
    'application/json': {
      schema: {
        $ref: '#/schemas/error',
      },
    },
  },
};
