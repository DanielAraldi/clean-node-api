export default `#graphql
  extend type Query {
    surveys: [Survey!]! @auth
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
