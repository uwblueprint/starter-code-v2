import { makeExecutableSchema, gql } from "apollo-server-express";
import { applyMiddleware } from "graphql-middleware";
import { merge } from "lodash";
import { createRateLimitRule } from "graphql-rate-limit";
import { shield } from "graphql-shield";

import {
  isAuthorizedByEmail,
  isAuthorizedByRole,
  isAuthorizedByUserId,
} from "../middlewares/auth.graphql";
import authResolvers from "./resolvers/authResolvers";
import authType from "./types/authType";
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
  typeDefs: [query, mutation, authType, entityType, userType],
  resolvers: merge(authResolvers, entityResolvers, userResolvers),
});

const authorizedByAllRoles = () =>
  isAuthorizedByRole(new Set(["User", "Admin"]));
const authorizedByAdmin = () => isAuthorizedByRole(new Set(["Admin"]));

const graphQLMiddlewares = {
  Query: {
    entity: authorizedByAllRoles(),
    entities: authorizedByAllRoles(),
    userById: authorizedByAdmin(),
    userByEmail: authorizedByAdmin(),
    users: authorizedByAdmin(),
  },
  Mutation: {
    createEntity: authorizedByAllRoles(),
    updateEntity: authorizedByAllRoles(),
    deleteEntity: authorizedByAllRoles(),
    createUser: authorizedByAdmin(),
    updateUser: authorizedByAdmin(),
    deleteUserById: authorizedByAdmin(),
    deleteUserByEmail: authorizedByAdmin(),
    logout: isAuthorizedByUserId("userId"),
    resetPassword: isAuthorizedByEmail("email"),
  },
};

const rateLimitRule = createRateLimitRule({
  identifyContext: (ctx) => ctx.id,
  formatError: () => "Too many requests, please try again later.",
});

const defaultMinuteRateLimit = parseInt(
  process.env.BACKEND_API_DEFAULT_PER_MINUTE_RATE_LIMIT || "15",
  10,
);

const rateLimiters = shield(
  {},
  {
    fallbackRule: rateLimitRule({
      window: "1m",
      max: defaultMinuteRateLimit,
    }),
  },
);

export default applyMiddleware(
  executableSchema,
  graphQLMiddlewares,
  rateLimiters,
);
