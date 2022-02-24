import mongoose from "mongoose";
import { resolve } from "path";
// eslint-disable-next-line import/no-extraneous-dependencies
import { MongoMemoryServer } from "mongodb-memory-server";

import { Sequelize } from "sequelize-typescript";

const mongo = new MongoMemoryServer();

const mongoTest = {
  connect: async (): Promise<void> => {
    await mongo.start();
    const uri = mongo.getUri();
    await mongoose.createConnection(uri);
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
    await Promise.all(promises);
  },
};

export default mongoTest;

const DATABASE_URL =
  process.env.NODE_ENV === "production"
    ? /* eslint-disable-next-line @typescript-eslint/no-non-null-assertion */
      process.env.DATABASE_URL!
    : `postgres://${process.env.POSTGRES_USER}:${process.env.POSTGRES_PASSWORD}@${process.env.DB_HOST}:5432/${process.env.POSTGRES_DB_TEST}`;

export const testSql = new Sequelize(DATABASE_URL, {
  models: [resolve(__dirname, "../models/*.pgmodel.ts")],
  logging: false,
});
