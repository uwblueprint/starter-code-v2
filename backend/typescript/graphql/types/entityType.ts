import { gql } from "apollo-server-express";

const entityType = gql`
  enum Enum {
    A
    B
    C
    D
  }

  // file-storage {
  scalar Upload

  // } file-storage
  type EntityResponseDTO {
    id: ID!
    stringField: String!
    intField: Int!
    enumField: Enum!
    stringArrayField: [String]!
    boolField: Boolean!
    // file-storage {
    fileName: String
    // } file-storage
  }

  input EntityRequestDTO {
    stringField: String!
    intField: Int!
    enumField: Enum!
    stringArrayField: [String]!
    boolField: Boolean!
    // file-storage {
    filePath: String
    contentType: String
    // } file-storage
  }

  extend type Query {
    entity(id: ID!): EntityResponseDTO!
    entities: [EntityResponseDTO!]!
    // file-storage {
    file(fileUUID: ID!): String!
    // } file-storage
  }

  extend type Mutation {
    // file-storage {
    createEntity(entity: EntityRequestDTO!, file: Upload): EntityResponseDTO!
    // } file-storage
    // no-file-storage {
    createEntity(entity: EntityRequestDTO!): EntityResponseDTO!
    // } no-file-storage
    // file-storage {
    updateEntity(
      id: ID!
      entity: EntityRequestDTO!
      file: Upload
    ): EntityResponseDTO!
    // } file-storage
    // no-file-storage {
    updateEntity(id: ID!, entity: EntityRequestDTO!): EntityResponseDTO!
    // } no-file-storage
    deleteEntity(id: ID!): ID
  }
`;

export default entityType;
