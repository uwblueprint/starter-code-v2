import React, { useState } from "react";
import { JSONSchema7 } from "json-schema";
import { Form } from "@rjsf/bootstrap-4";
import JSONPretty from "react-json-pretty";
import EntityAPIClient from "../../APIClients/EntityAPIClient";

enum EnumField {
  "A",
  "B",
  "C",
  "D",
}

type EntityResponse = {
  id: string | number;
  stringField: string;
  intField: number;
  stringArrayField: string[];
  enumField: EnumField;
  boolField: boolean;
};

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

const CreateForm = () => {
  const [data, setData] = useState<EntityResponse | undefined>(undefined);

  if (data) {
    return (
      <div>
        <JSONPretty id="json-pretty" data={data} />
      </div>
    );
  }

  const onSubmit = async ({ formData }: { formData: any }) => {
    const result = await EntityAPIClient.create({ formData });
    setData(result);
  };
  return <Form schema={schema} uiSchema={uiSchema} onSubmit={onSubmit} />;
};

export default CreateForm;
