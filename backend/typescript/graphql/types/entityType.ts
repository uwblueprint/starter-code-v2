import { gql } from "apollo-server-express";

const entityType = gql`
  enum Enum {
    A
    B
    C
  }

  type Entity {
    id: String
    stringField: String
    intField: Int
    enumField: Enum
    stringArrayField: [String]
    boolField: Boolean
  }

  input EntityRequestDTO {
    stringField: String
    intField: Int
    enumField: Enum
    stringArrayField: [String]
    boolField: Boolean
  }

  extend type Query {
    entity(id: String): Entity
    entities: [Entity!]!
  }

  extend type Mutation {
    createEntity(
      stringField: String
      intField: Int
      enumField: Enum
      stringArrayField: [String]
      boolField: Boolean
    ): Entity
    updateEntity(id: String, obj: EntityRequestDTO!): Entity
    deleteEntity(id: ID!): ID
  }
`;

export default entityType;
