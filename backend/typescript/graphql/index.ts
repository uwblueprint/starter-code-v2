import { makeExecutableSchema, gql } from "apollo-server-express";
import { merge } from "lodash";

import entityResolvers from "./resolvers/entityResolvers";
import entityType from "./types/entityType";
import userResolvers from "./resolvers/userResolvers";
import userType from "./types/userType";

const query = gql`
  type Query {
    _empty: String
  }
`;

const mutation = gql`
  type Mutation {
    _empty: String
  }
`;

const executableSchema = makeExecutableSchema({
  typeDefs: [query, mutation, entityType, userType],
  resolvers: merge(entityResolvers, userResolvers),
});

export default executableSchema;
