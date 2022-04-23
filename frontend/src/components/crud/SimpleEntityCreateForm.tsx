import React, { useState } from "react";
// python {
import { decamelizeKeys } from "humps";
// } python
import { JSONSchema7 } from "json-schema";
import { Form } from "@rjsf/bootstrap-4";
// graphql {
import { gql, useMutation } from "@apollo/client";

import {
  SimpleEntityRequest,
  SimpleEntityResponse,
} from "../../APIClients/SimpleEntityAPIClient";
// } graphql
// rest {
import SimpleEntityAPIClient, {
  SimpleEntityRequest,
  SimpleEntityResponse,
} from "../../APIClients/SimpleEntityAPIClient";
// } rest

const schema: JSONSchema7 = {
  title: "Create Simple Entity",
  description: "A simple form to test creating a simple entity",
  type: "object",
  required: [
    "stringField",
    "intField",
    "stringArrayField",
    "enumField",
    "boolField",
  ],
  properties: {
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
const CREATE_SIMPLE_ENTITY = gql`
  mutation SimpleEntityCreateForm_CreateSimpleEntity(
    $entity: SimpleEntityRequestDTO!
  ) {
    createSimpleEntity(entity: $entity) {
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
const SimpleEntityCreateForm = (): React.ReactElement => {
  const [data, setData] = useState<SimpleEntityResponse | null>(null);
  const [formFields, setFormFields] = useState<SimpleEntityRequest | null>(
    null,
  );

  // graphql {
  const [createSimpleEntity] = useMutation<{
    createSimpleEntity: SimpleEntityResponse;
  }>(CREATE_SIMPLE_ENTITY);

  // } graphql
  if (data) {
    return <p>Created! ✔️</p>;
  }

  const onSubmit = async ({ formData }: { formData: SimpleEntityRequest }) => {
    // graphql {
    const graphQLResult = await createSimpleEntity({
      variables: { entity: formData },
    });
    const result: SimpleEntityResponse | null =
      graphQLResult.data?.createSimpleEntity ?? null;
    // } graphql
    // rest {
    const result = await SimpleEntityAPIClient.create({ formData });
    // } rest
    setData(result);
  };
  return (
    <Form
      formData={formFields}
      schema={schema}
      uiSchema={uiSchema}
      onChange={({ formData }: { formData: SimpleEntityRequest }) =>
        setFormFields(formData)
      }
      onSubmit={onSubmit}
    />
  );
};

export default SimpleEntityCreateForm;
