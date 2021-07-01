import React, { useState } from "react";
import { JSONSchema7 } from "json-schema";
import { Form } from "@rjsf/bootstrap-4";
// graphql {
import { gql, useMutation } from "@apollo/client";

import {
  EntityRequest,
  EntityResponse,
} from "../../APIClients/EntityAPIClient";
// } graphql
// rest {
import EntityAPIClient, {
  EntityResponse,
} from "../../APIClients/EntityAPIClient";
// } rest

const schema: JSONSchema7 = {
  title: "Update Entity",
  description: "A simple form to test updating an entity",
  type: "object",
  required: [
    "id",
    "stringField",
    "intField",
    "stringArrayField",
    "enumField",
    "boolField",
  ],
  properties: {
    id: {
      type: "string",
      title: "entity id",
      default: "123abc456def7890ghij1234",
    },
    stringField: {
      type: "string",
      title: "String Field",
      default: "UW Blueprint",
    },
    intField: {
      type: "integer",
      title: "Integer Field",
      default: 2017,
    },
    stringArrayField: {
      type: "array",
      items: {
        type: "string",
      },
      title: "String Array Field",
      default: [],
    },
    enumField: {
      type: "string",
      enum: ["A", "B", "C", "D"],
      title: "Enum Field",
      default: "A",
    },
    boolField: {
      type: "boolean",
      title: "Boolean Field",
      default: true,
    },
  },
};

const uiSchema = {
  boolField: {
    "ui:widget": "select",
  },
};

// graphql {
const UPDATE_ENTITY = gql`
  mutation UpdateForm_UpdateEntity($id: ID!, $entity: EntityRequestDTO!) {
    updateEntity(id: $id, entity: $entity) {
      id
      stringField
      intField
      enumField
      stringArrayField
      boolField
    }
  }
`;

// } graphql
const UpdateForm = (): React.ReactElement => {
  const [data, setData] = useState<EntityResponse | null>(null);

  // graphql {
  const [updateEntity] = useMutation<{ updateEntity: EntityResponse }>(
    UPDATE_ENTITY,
  );

  // } graphql
  if (data) {
    return <p>Updated! ✔️</p>;
  }

  const onSubmit = async ({ formData }: { formData: EntityResponse }) => {
    const { id, ...entityData } = formData;

    // graphql {
    const graphQLResult = await updateEntity({
      variables: { id: formData.id, entity: entityData as EntityRequest },
    });
    const result: EntityResponse | null =
      graphQLResult.data?.updateEntity ?? null;
    // } graphql
    // rest {
    const result = await EntityAPIClient.update(formData.id, { entityData });
    // } rest
    setData(result);
  };
  return <Form schema={schema} uiSchema={uiSchema} onSubmit={onSubmit} />;
};

export default UpdateForm;
