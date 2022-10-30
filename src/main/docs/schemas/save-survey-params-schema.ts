export const saveSurveyParamsSchema = {
  type: 'object',
  properties: {
    answerId: { type: 'string' },
  },
  required: ['answerId'],
};
