export default `#graphql
  scalar DateTime

  extend type Query {
    surveys: [Survey!]!
  }

  type Survey {
    id: ID!
    question: String!
    answers: [SurveyAnswer!]!
    date: DateTime!
    didAnswer: Boolean
  }

  type SurveyAnswer {
    answerId: ID!
    answer: String!
    image: String
  }
`;
