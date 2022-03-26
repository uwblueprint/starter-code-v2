import { makeExecutableSchema, gql } from "apollo-server-express";
// auth {
import { applyMiddleware } from "graphql-middleware";
// } auth
import { merge } from "lodash";

// auth {
import {
  isAuthorizedByEmail,
  isAuthorizedByRole,
  isAuthorizedByUserId,
} from "../middlewares/auth";
import authResolvers from "./resolvers/authResolvers";
import authType from "./types/authType";
// } auth
import entityResolvers from "./resolvers/entityResolvers";
import entityType from "./types/entityType";
import simpleEntityResolvers from "./resolvers/simpleEntityResolvers";
import simpleEntityType from "./types/simpleEntityType";
// auth {
import userResolvers from "./resolvers/userResolvers";
import userType from "./types/userType";
// } auth

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

// no-auth {
const executableSchema = makeExecutableSchema({
  typeDefs: [query, mutation, entityType, simpleEntityType],
  resolvers: merge(entityResolvers, simpleEntityResolvers),
});

export default executableSchema;

// } no-auth
// auth {
const executableSchema = makeExecutableSchema({
  typeDefs: [query, mutation, authType, entityType, simpleEntityType, userType],
  resolvers: merge(
    authResolvers,
    entityResolvers,
    simpleEntityResolvers,
    userResolvers,
  ),
});

const authorizedByAllRoles = () =>
  isAuthorizedByRole(new Set(["User", "Admin"]));
const authorizedByAdmin = () => isAuthorizedByRole(new Set(["Admin"]));

const graphQLMiddlewares = {
  Query: {
    entity: authorizedByAllRoles(),
    entities: authorizedByAllRoles(),
    simpleEntity: authorizedByAllRoles(),
    simpleEntities: authorizedByAllRoles(),
    userById: authorizedByAdmin(),
    userByEmail: authorizedByAdmin(),
    users: authorizedByAdmin(),
  },
  Mutation: {
    createEntity: authorizedByAllRoles(),
    updateEntity: authorizedByAllRoles(),
    deleteEntity: authorizedByAllRoles(),
    createSimpleEntity: authorizedByAllRoles(),
    updateSimpleEntity: authorizedByAllRoles(),
    deleteSimpleEntity: authorizedByAllRoles(),
    createUser: authorizedByAdmin(),
    updateUser: authorizedByAdmin(),
    deleteUserById: authorizedByAdmin(),
    deleteUserByEmail: authorizedByAdmin(),
    logout: isAuthorizedByUserId("userId"),
    resetPassword: isAuthorizedByEmail("email"),
  },
};

export default applyMiddleware(executableSchema, graphQLMiddlewares);

// } auth