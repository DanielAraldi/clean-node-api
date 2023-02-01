export const surveySchema = {
  type: 'object',
  properties: {
    id: { type: 'string' },
    question: { type: 'string' },
    answers: {
      type: 'array',
      items: { $ref: '#/schemas/surveyAnswer' },
    },
    date: { type: 'string' },
    didAnswer: { type: 'boolean' },
  },
  required: ['id', 'question', 'answers', 'date'],
  example: {
    id: 'any_id',
    question: 'any_question',
    answers: [
      {
        answerId: 'any_answer_id',
        answer: 'any_answer',
        image: 'https://any_image.com',
      },
      {
        answerId: 'other_answer_id',
        answer: 'other_answer',
        image: 'https://other_image.com',
      },
    ],
    date: '2023-02-01T12:27:25.394Z',
  },
};
