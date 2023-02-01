export const addSurveyAnswerSchema = {
  type: 'object',
  properties: {
    answer: { type: 'string' },
    image: { type: 'string' },
  },
  required: ['answer'],
  example: {
    answer: 'any_answer',
    image: 'https://any_image.com',
  },
};
