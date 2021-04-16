import { Column, DataType, Model, Table } from "sequelize-typescript";
import { Role } from "../types";

@Table({ tableName: "users" })
export default class User extends Model {
  @Column({ type: DataType.STRING })
  firstName!: string;

  @Column({ type: DataType.STRING })
  lastName!: string;

  @Column({ type: DataType.STRING })
  authId!: string;

  @Column({ type: DataType.ENUM("User", "Admin") })
  role!: Role;
}
