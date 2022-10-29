export const surveyAnswerSchema = {
  type: 'object',
  properties: {
    answerId: { type: 'string' },
    answer: { type: 'string' },
    image: { type: 'string' },
  },
  required: ['answerId', 'answer'],
};
