export const addSurveyAnswerSchema = {
  type: 'object',
  properties: {
    answer: { type: 'string' },
    image: { type: 'string' },
  },
  required: ['answer'],
};
