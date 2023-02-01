export const addSurveyParamsSchema = {
  type: 'object',
  properties: {
    question: { type: 'string' },
    answers: {
      type: 'array',
      items: { $ref: '#/schemas/addSurveyAnswer' },
    },
  },
  required: ['question', 'answers'],
  example: {
    question: 'any_question',
    answers: [
      {
        answer: 'any_answer',
        image: 'https://any_image.com',
      },
      {
        answer: 'other_answer',
      },
    ],
  },
};
