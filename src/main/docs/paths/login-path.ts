export const loginPath = {
  post: {
    tags: ['Login'],
    summary: 'Perform user login.',
    description: 'Login the user into the system and returns an access token.',
    requestBody: {
      content: {
        'application/json': {
          schema: {
            // There must be a property of the same name in the schemas object in index main
            $ref: '#/schemas/loginParams',
          },
        },
      },
    },
    responses: {
      200: {
        description: 'Requisition Success!',
        content: {
          'application/json': {
            schema: {
              $ref: '#/schemas/account',
            },
          },
        },
      },
      400: {
        $ref: '#/components/badRequest',
      },
      401: {
        $ref: '#/components/unanthorized',
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
