// mongodb {
import { Schema, Document, model } from "mongoose";

export interface Entity extends Document {
  id: string;
  stringField: string;
  intField: number;
  enumField: string;
  stringArrayField: [string];
  boolField: boolean;
  fileName: string;
}

const EntitySchema: Schema = new Schema({
  stringField: {
    type: String,
    required: true,
  },
  intField: {
    type: Number,
    required: true,
  },
  enumField: {
    type: String,
    enum: ["A", "B", "C", "D"],
    required: true,
  },
  stringArrayField: {
    type: [String],
    required: true,
  },
  boolField: {
    type: Boolean,
    required: true,
  },
  fileName: {
    type: String,
  },
});

export default model<Entity>("Entity", EntitySchema);

// } mongodb
// postgresql {
import { Column, Model, Table, DataType } from "sequelize-typescript";

import { Letters } from "../types";

@Table({ tableName: "entities" })
export default class Entity extends Model {
  @Column
  string_field!: string;

  @Column
  int_field!: number;

  @Column({ type: DataType.ENUM("A", "B", "C", "D") })
  enum_field!: Letters;

  @Column({ type: DataType.ARRAY(DataType.STRING) })
  string_array_field!: string[];

  @Column
  bool_field!: boolean;

  @Column
  file_name!: string;
}

// } postgresql