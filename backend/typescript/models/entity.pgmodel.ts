import { Column, Model, Table } from "sequelize-typescript";

@Table({ tableName: "entity" })
export default class Entity extends Model {
    @Column
    string_field!: string;

    @Column
    int_field!: string;

    @Column
    enum_field!: string;

    @Column
    string_array_field!: string;

    @Column
    bool_field!: string;
}
