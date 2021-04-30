// mongodb {
import mongoose, { Schema, Document } from "mongoose";

import { Role } from "../types";

export interface User extends Document {
  id: string;
  firstName: string;
  lastName: string;
  authId: string;
  role: Role;
}

const UserSchema: Schema = new Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  authId: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
    enum: ["User", "Admin"],
  },
});

export default mongoose.model<User>("User", UserSchema);

// } mongodb
// postgresql {
import { Column, DataType, Model, Table } from "sequelize-typescript";
import { Role } from "../types";

@Table({ tableName: "users" })
export default class User extends Model {
  @Column({ type: DataType.STRING })
  first_name!: string;

  @Column({ type: DataType.STRING })
  last_name!: string;

  @Column({ type: DataType.STRING })
  auth_id!: string;

  @Column({ type: DataType.ENUM("User", "Admin") })
  role!: Role;
}

// } postgresql