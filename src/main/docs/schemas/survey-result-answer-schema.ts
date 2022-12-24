export const surveyResultAnswerSchema = {
  type: 'object',
  properties: {
    answerId: { type: 'string' },
    answer: { type: 'string' },
    count: { type: 'integer' },
    percent: { type: 'number' },
    image: { type: 'string' },
  },
  required: ['answerId', 'answer', 'count', 'percent'],
};
