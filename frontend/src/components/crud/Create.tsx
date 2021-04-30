import React, { useState } from "react";
import { JSONSchema7 } from "json-schema";
import { Form } from "@rjsf/bootstrap-4";
import CrudAPIClient from "../../APIClients/CrudAPIClient";

const pythonSchema: JSONSchema7 = {
  title: "Create Entity",
  description: "A simple form to test creating an entity",
  type: "object",
  required: [
    "string_field",
    "int_field",
    "string_array_field",
    "enum_field",
    "bool_field",
  ],
  properties: {
    string_field: {
      type: "string",
      title: "String Field",
      default: "UW Blueprint",
    },
    int_field: {
      type: "integer",
      title: "Integer Field",
      default: 2017,
    },
    string_array_field: {
      type: "array",
      items: {
        type: "string",
      },
      title: "String Array Field",
      default: [],
    },
    enum_field: {
      type: "string",
      enum: ["A", "B", "C", "D"],
      title: "Enum Field",
      default: "B",
    },
    bool_field: {
      type: "boolean",
      title: "Boolean Field",
      default: true,
    },
  },
};

// const typescriptSchema: JSONSchema7 = {
//   title: "Create Entity",
//   description: "A simple form to test creating an entity",
//   type: "object",
//   required: [
//     "id",
//     "stringField",
//     "intField",
//     "stringArrayField",
//     "enumField",
//     "boolField",
//   ],
//   properties: {
//     id: {
//       type: "integer",
//       title: "entity id",
//       default: "2017"
//     },
//     stringField: {
//       type: "string",
//       title: "String Field",
//     },
//     intField: {
//       type: "integer",
//       title: "Integer Field",
//     },
//     stringArrayField: {
//       type: "array",
//       items: {
//         type: "string",
//       },
//       title: "String Array Field",
//       default: [],
//     },
//     enumField: {
//       type: "string",
//       enum: ["A", "B", "C", "D"],
//       title: "Enum Field",
//     },
//     boolField: {
//       type: "boolean",
//       title: "Boolean Field",
//     },
//   },
// };

const CreateForm = () => {
  const [response, setResponse] = useState(false);
  const [data, setData] = useState("Hello");

  if (response) {
    console.log("YO");
    console.log("RESPONSE");
    console.log(data);
    return <div> {JSON.stringify(data)} </div>;
  }

  const onSubmit = async ({ formData }: { formData: any }) => {
    const result = await CrudAPIClient.create({ formData });
    setResponse(true);
    setData(result);
  };
  return <Form schema={pythonSchema} onSubmit={onSubmit} />;
};

export default CreateForm;
