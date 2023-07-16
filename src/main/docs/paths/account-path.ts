export const accountPath = {
  put: {
    security: [{ apiKeyAuth: [] }],
    tags: ['Account'],
    summary: 'Update for name and e-mail.',
    description: 'Change name and e-mail user. Made only by logged in users.',
    requestBody: {
      content: {
        'application/json': {
          schema: {
            $ref: '#/schemas/accountEditParams',
          },
        },
      },
    },
    responses: {
      204: {
        description: 'Request made successfully, your data was edited!',
      },
      403: {
        $ref: '#/components/forbidden',
      },
      404: {
        $ref: '#/components/notFound',
      },
      500: {
        $ref: '#/components/serverError',
      },
    },
  },
};
