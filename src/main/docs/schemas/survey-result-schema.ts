export const surveyResultSchema = {
  type: 'object',
  properties: {
    surveyId: { type: 'string' },
    question: { type: 'string' },
    answers: {
      type: 'array',
      items: {
        $ref: '#/schemas/surveyResultAnswer',
      },
    },
    date: { type: 'string' },
  },
  required: ['surveyId', 'question', 'answers', 'date'],
  example: {
    surveyId: 'any_survey_id',
    question: 'any_question',
    answers: [
      {
        answerId: 'any_answer_id',
        answer: 'any_answer',
        count: 1,
        percent: 100,
        image: 'https://any_image.com',
        isCurrentAccountAnswer: true,
      },
      {
        answerId: 'other_answer_id',
        answer: 'other_answer',
        count: 0,
        percent: 0,
        image: 'https://other_image.com',
        isCurrentAccountAnswer: false,
      },
    ],
    date: '2023-02-01T12:27:25.394Z',
  },
};
