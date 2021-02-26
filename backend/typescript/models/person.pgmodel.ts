import { Column, Model, Table } from "sequelize-typescript";

@Table({ tableName: "people" })
export default class Person extends Model {
  @Column
  name!: string;

  @Column
  email!: string;
}
