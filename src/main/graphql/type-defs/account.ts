export default `#graphql
  extend type Mutation {
    edit (name: String, email: String): Void! @auth
  }
`;
