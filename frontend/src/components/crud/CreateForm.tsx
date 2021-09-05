import React, { useState } from "react";
// python {
import { decamelizeKeys } from "humps";
// } python
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
// import EntityAPIClient, {
//   EntityRequest,
//   EntityResponse,
// } from "../../APIClients/EntityAPIClient";
// } rest

const schema: JSONSchema7 = {
  title: "Create Entity",
  description: "A simple form to test creating an entity",
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
const CREATE_ENTITY = gql`
  mutation CreateForm_CreateEntity($entity: EntityRequestDTO!, $file: Upload) {
    createEntity(entity: $entity, file: $file) {
      id
      stringField
      intField
      enumField
      stringArrayField
      boolField
      fileName
    }
  }
`;
// } graphql

const CreateForm = (): React.ReactElement => {
  const [data, setData] = useState<EntityResponse | null>(null);
  const [fileField, setFileField] = useState<File | null>(null);

  // graphql {
  const [createEntity] = useMutation<{ createEntity: EntityResponse }>(
    CREATE_ENTITY,
  );
  // } graphql

  if (data) {
    return <p>Created! ✔️</p>;
  }

  const fileChanged = (e: { target: HTMLInputElement }) => {
    if (e.target.files) {
      const fileSize = e.target.files[0].size / 1024 / 1024;
      if (fileSize > 5) {
        // eslint-disable-next-line no-alert
        window.alert("Your file exceeds 5MB. Upload a smaller file.");
      } else {
        setFileField(e.target.files[0]);
      }
    }
  };

  const onSubmit = async ({ formData }: { formData: EntityRequest }) => {
    // graphql {
    const graphQLResult = await createEntity({
      variables: { entity: formData, file: fileField },
    });
    const result: EntityResponse | null =
      graphQLResult.data?.createEntity ?? null;
    // } graphql
    // rest {
    // const multipartFormData = new FormData();
    // // typescript {
    // multipartFormData.append("body", JSON.stringify(formData));
    // // } typescript
    // // python {
    // multipartFormData.append("body", JSON.stringify(decamelizeKeys(formData)));
    // // } python
    // if (fileField) {
    //   multipartFormData.append("file", fileField);
    // }
    // const result = await EntityAPIClient.create({ formData: multipartFormData });
    // } rest
    setData(result);
  };
  return (
    <>
      <input type="file" onChange={fileChanged} />
      <Form schema={schema} uiSchema={uiSchema} onSubmit={onSubmit} />
    </>
  );
};

export default CreateForm;
