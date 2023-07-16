export default `#graphql
  scalar DateTime
  scalar Void

  directive @auth on FIELD_DEFINITION

  type Query {
    _: String
  }

  type Mutation {
    _: String
  }
`;
