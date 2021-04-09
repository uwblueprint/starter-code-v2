import { gql } from "apollo-server-express";

const authType = gql`
  extend type Mutation {
    login(email: String!, password: String!): String!
    refresh: String!
    logout(userId: ID!): ID
    resetPassword(email: String!): String!
  }
`;

export default authType;
