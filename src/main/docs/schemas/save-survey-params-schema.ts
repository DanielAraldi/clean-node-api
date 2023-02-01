export const saveSurveyParamsSchema = {
  type: 'object',
  properties: {
    answerId: { type: 'string' },
  },
  required: ['answerId'],
  example: {
    answerId: 'any_answer_id',
  },
};
