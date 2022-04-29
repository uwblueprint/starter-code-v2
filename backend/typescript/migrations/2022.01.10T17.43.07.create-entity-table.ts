import { DataType } from "sequelize-typescript";

import { Migration } from "../umzug";

const TABLE_NAME = "entities";

export const up: Migration = async ({ context: sequelize }) => {
  await sequelize.getQueryInterface().createTable(TABLE_NAME, {
    id: {
      type: DataType.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    string_field: {
      type: DataType.STRING,
      allowNull: false,
    },
    int_field: {
      type: DataType.INTEGER,
      allowNull: false,
    },
    enum_field: {
      type: DataType.ENUM("A", "B", "C", "D"),
      allowNull: false,
    },
    string_array_field: {
      type: DataType.ARRAY(DataType.STRING),
      allowNull: false,
    },
    bool_field: {
      type: DataType.BOOLEAN,
      allowNull: false,
    },
    file_name: {
      type: DataType.STRING,
      allowNull: false,
    },
    createdAt: DataType.DATE,
    updatedAt: DataType.DATE,
  });
};

export const down: Migration = async ({ context: sequelize }) => {
  await sequelize.getQueryInterface().dropTable(TABLE_NAME);
};
