import React, { useState } from "react";
import { JSONSchema7 } from "json-schema";
import { Form } from "@rjsf/bootstrap-4";
import EntityAPIClient, {
  EntityResponse,
} from "../../APIClients/EntityAPIClient";

const schema: JSONSchema7 = {
  title: "Create Entity",
  description: "A simple form to test creating an entity",
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
      default: "2017",
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

const UpdateForm = () => {
  const [data, setData] = useState<EntityResponse | null>(null);

  if (data) {
    return <p>Updated! ✔️</p>;
  }

  const onSubmit = async ({ formData }: { formData: any }) => {
    const entityData: any = JSON.parse(JSON.stringify(formData));
    delete entityData.id;
    const result = await EntityAPIClient.update(formData.id, { entityData });
    setData(result);
  };
  return <Form schema={schema} uiSchema={uiSchema} onSubmit={onSubmit} />;
};

export default UpdateForm;
