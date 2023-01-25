export default `#graphql
  extend type Query {
    login (email: String!, password: String!): Account!
  }

  type Account {
    accessToken: String!
    name: String!
  }
`;
