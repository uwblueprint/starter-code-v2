import { gql } from "apollo-server-express";

const entityType = gql`
  enum Enum {
    A
    B
    C
    D
  }

  scalar Upload

  type EntityResponseDTO {
    id: ID!
    stringField: String!
    intField: Int!
    enumField: Enum!
    stringArrayField: [String]!
    boolField: Boolean!
    fileName: String!
  }

  input EntityRequestDTO {
    stringField: String!
    intField: Int!
    enumField: Enum!
    stringArrayField: [String]!
    boolField: Boolean!
    fileName: String!
  }

  extend type Query {
    entity(id: ID!): EntityResponseDTO!
    entities: [EntityResponseDTO!]!
    file(fileUUID: String!): ID!
  }

  extend type Mutation {
    createEntity(entity: EntityRequestDTO!, file: Upload): EntityResponseDTO!
    updateEntity(
      id: ID!
      entity: EntityRequestDTO!
      file: Upload
    ): EntityResponseDTO!
    deleteEntity(id: ID!): ID
  }
`;

export default entityType;
