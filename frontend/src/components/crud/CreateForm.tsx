import React, { useState } from "react";
// python {
// import { decamelizeKeys } from "humps";
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
import EntityAPIClient, {
  EntityRequest,
  EntityResponse,
} from "../../APIClients/EntityAPIClient";
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
// no-file-storage {
const CREATE_ENTITY = gql`
  mutation CreateForm_CreateEntity($entity: EntityRequestDTO!) {
    createEntity(entity: $entity) {
      id
      stringField
      intField
      enumField
      stringArrayField
      boolField
    }
  }
`;
// } no-file-storage
// file-storage {
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
// } file-storage

// } graphql
const CreateForm = (): React.ReactElement => {
  const [data, setData] = useState<EntityResponse | null>(null);
  // file-storage {
  const [fileField, setFileField] = useState<File | null>(null);
  // } file-storage
  const [formFields, setFormFields] = useState<EntityRequest | null>(null);

  // graphql {
  const [createEntity] = useMutation<{ createEntity: EntityResponse }>(
    CREATE_ENTITY,
  );

  // } graphql
  if (data) {
    return <p>Created! ✔️</p>;
  }

  // file-storage {
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

  // } file-storage
  const onSubmit = async ({ formData }: { formData: EntityRequest }) => {
    // graphql {
    // no-file-storage {
    const graphQLResult = await createEntity({
      variables: { entity: formData },
    });
    // } no-file-storage
    // file-storage {
    const graphQLResult = await createEntity({
      variables: { entity: formData, file: fileField },
    });
    // } file-storage
    const result: EntityResponse | null =
      graphQLResult.data?.createEntity ?? null;
    // } graphql
    // rest {
    // no-file-storage {
    const result = await EntityAPIClient.create({ formData });
    // } no-file-storage
    // file-storage {
    const multipartFormData = new FormData();
    // typescript {
    multipartFormData.append("body", JSON.stringify(formData));
    // } typescript
    // python {
    multipartFormData.append("body", JSON.stringify(decamelizeKeys(formData)));
    // } python
    if (fileField) {
      multipartFormData.append("file", fileField);
    }
    const result = await EntityAPIClient.create({ formData: multipartFormData });
    // } file-storage
    // } rest
    setData(result);
  };
  // no-file-storage {
  return (
    <Form
      formData={formFields}
      schema={schema}
      uiSchema={uiSchema}
      onChange={({ formData }: { formData: EntityRequest }) =>
        setFormFields(formData)
      }
      onSubmit={onSubmit}
    />
  );
  // } no-file-storage
  // file-storage {
  return (
    <>
      <input type="file" onChange={fileChanged} />
      <Form
        formData={formFields}
        schema={schema}
        uiSchema={uiSchema}
        onChange={({ formData }: { formData: EntityRequest }) =>
          setFormFields(formData)
        }
        onSubmit={onSubmit}
      />
    </>
  );
  // } file-storage
};

export default CreateForm;
