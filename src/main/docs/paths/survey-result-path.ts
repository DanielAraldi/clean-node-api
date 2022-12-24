export const surveyResultPath = {
  put: {
    security: [{ apiKeyAuth: [] }],
    tags: ['Survey'],
    summary: 'Create a survey response.',
    description: 'Creates a survey response. Made only by logged in users.',
    parameters: [
      {
        in: 'path',
        name: 'surveyId',
        required: true,
        schema: {
          type: 'string',
          description: 'Id of the survey that the user wants to answer.',
        },
      }
    ],
    requestBody: {
      content: {
        'application/json': {
          schema: {
            $ref: '#/schemas/saveSurveyParams',
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
              $ref: '#/schemas/surveyResult',
            },
          },
        },
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
