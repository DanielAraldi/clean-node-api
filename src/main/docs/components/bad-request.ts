export const badRequest = {
  description: 'Invalid Requisition!',
  content: {
    'application/json': {
      schema: {
        $ref: '#/schemas/error',
      },
    },
  },
};
