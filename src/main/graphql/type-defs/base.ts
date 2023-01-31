export default `#graphql
  scalar DateTime

  directive @auth on FIELD_DEFINITION

  type Query {
    _: String
  }

  type Mutation {
    _: String
  }
`;
