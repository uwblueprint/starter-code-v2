import { Column, Model, Table, DataType } from "sequelize-typescript";

@Table({ tableName: "entity" })
export default class Entity extends Model {
  @Column
  string_field!: string;

  @Column
  int_field!: number;

  @Column
  enum_field!: string;

  @Column({ type: DataType.ARRAY(DataType.STRING) })
  string_array_field!: string[];

  @Column
  bool_field!: boolean;
}
