export default `#graphql
  extend type Query {
    surveyResult (surveyId: String!): SurveyResult!
  }

  extend type Mutation {
    saveSurveyResult (surveyId: String!, answerId: String!): SurveyResult!
  }

  type SurveyResult {
    surveyId: ID!
    question: String!
    answers: [Answer!]!
    date: DateTime!
  }

  type Answer {
    answerId: ID!
    answer: String!
    count: Int!
    percent: Float!
    image: String
    isCurrentAccountAnswer: Boolean!
  }
`;
