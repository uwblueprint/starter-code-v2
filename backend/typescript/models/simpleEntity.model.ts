// mongodb {
import { Schema, Document, model } from "mongoose";

export interface SimpleEntity extends Document {
  id: string;
  stringField: string;
  intField: number;
  enumField: string;
  stringArrayField: [string];
  boolField: boolean;
}

const SimpleEntitySchema: Schema = new Schema({
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
});

export default model<SimpleEntity>("SimpleEntity", SimpleEntitySchema);

// } mongodb
// postgresql {
import { Column, Model, Table, DataType } from "sequelize-typescript";

import { Letters } from "../types";

@Table({ tableName: "simple_entities" })
export default class SimpleEntity extends Model {
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
}

// } postgresql