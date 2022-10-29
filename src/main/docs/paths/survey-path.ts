export const surveyPath = {
  get: {
    security: [{ apiKeyAuth: [] }],
    tags: ['Survey'],
    summary: 'API to list all surveys.',
    description:
      'Lists all existing surveys in the system for the logged in user.',
    responses: {
      200: {
        description: 'Requisition Success!',
        content: {
          'application/json': {
            schema: {
              $ref: '#/schemas/surveys',
            },
          },
        },
      },
      204: {
        description:
          'Request made successfully, but there are no registered surveys!',
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
  post: {
    security: [{ apiKeyAuth: [] }],
    tags: ['Survey'],
    summary: 'Create a survey.',
    description: 'Create a survey. Only administrators can create a survey.',
    requestBody: {
      content: {
        'application/json': {
          schema: {
            $ref: '#/schemas/addSurveyParams',
          },
        },
      },
    },
    responses: {
      204: {
        description: 'Requisition Success!',
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
