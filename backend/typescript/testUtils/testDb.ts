import mongoose from "mongoose";
import { resolve } from "path";
// eslint-disable-next-line import/no-extraneous-dependencies
import { MongoMemoryServer } from "mongodb-memory-server";

import { Sequelize } from "sequelize-typescript";

const mongo = new MongoMemoryServer();

const mongoTest = {
  connect: async (): Promise<void> => {
    const uri = await mongo.getUri();
    await mongoose.connect(uri, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
      useFindAndModify: false,
    });
  },
  disconnect: async (): Promise<void> => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    await mongo.stop();
  },
  clear: async (): Promise<void> => {
    const { collections } = mongoose.connection;
    const promises = Object.keys(collections).map((key) => {
      return collections[key].deleteMany({});
    });
    Promise.all(promises);
  },
};

export default mongoTest;

export const testSql = new Sequelize(
  `postgres://${process.env.POSTGRES_USER}:${process.env.POSTGRES_PASSWORD}@localhost:5430/${process.env.POSTGRES_DB}`,
  { models: [resolve(__dirname, "../models/*.pgmodel.ts")], logging: false },
);
