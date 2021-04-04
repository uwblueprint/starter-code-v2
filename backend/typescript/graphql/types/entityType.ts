import { gql } from "apollo-server-express";

const entityType = gql`
  enum Enum {
    A
    B
    C
    D
  }
  type EntityResponseDTO {
    id: String!
    stringField: String!
    intField: Int!
    enumField: Enum!
    stringArrayField: [String]!
    boolField: Boolean!
  }
  input EntityRequestDTO {
    stringField: String!
    intField: Int!
    enumField: Enum!
    stringArrayField: [String]!
    boolField: Boolean!
  }
  extend type Query {
    entity(id: String!): EntityResponseDTO!
    entities: [EntityResponseDTO!]!
  }
  extend type Mutation {
    createEntity(entity: EntityRequestDTO!): EntityResponseDTO!
    updateEntity(id: ID!, entity: EntityRequestDTO!): EntityResponseDTO!
    deleteEntity(id: ID!): ID
  }
`;

export default entityType;
