export const surveyAnswerSchema = {
  type: 'object',
  properties: {
    answerId: { type: 'string' },
    answer: { type: 'string' },
    image: { type: 'string' },
  },
  required: ['answerId', 'answer'],
  example: {
    answerId: 'any_answer_id',
    answer: 'any_answer',
    image: 'https://any_image.com',
  },
};
