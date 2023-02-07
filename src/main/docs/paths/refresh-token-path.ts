export const refreshTokenPath = {
  post: {
    tags: ['Login'],
    summary: 'Update user access token.',
    description: "Updates your user's access token.",
    requestBody: {
      content: {
        'application/json': {
          schema: {
            $ref: '#/schemas/refreshTokenParams',
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
              $ref: '#/schemas/refreshToken',
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
