export const surveyResultAnswerSchema = {
  type: 'object',
  properties: {
    answerId: { type: 'string' },
    answer: { type: 'string' },
    count: { type: 'integer' },
    percent: { type: 'number' },
    image: { type: 'string' },
    isCurrentAccountAnswer: { type: 'boolean' },
  },
  required: [
    'answerId',
    'answer',
    'count',
    'percent',
    'isCurrentAccountAnswer',
  ],
  example: {
    answerId: 'any_answer_id',
    answer: 'any_answer',
    count: 1,
    percent: 100,
    image: 'https://any_image.com',
    isCurrentAccountAnswer: true,
  },
};
