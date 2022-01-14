// mongodb {
import mongoose from "mongoose";
// } mongodb
// postgresql {
import { resolve } from "path";
// } postgresql
// mongodb {
// eslint-disable-next-line import/no-extraneous-dependencies
import { MongoMemoryServer } from "mongodb-memory-server";
// } mongodb

// postgresql {
import { Sequelize } from "sequelize-typescript";
// } postgresql

// mongodb {
const mongo = new MongoMemoryServer();

const mongoTest = {
  connect: async (): Promise<void> => {
    await mongo.start();
    const uri = mongo.getUri();
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
    await Promise.all(promises);
  },
};

export default mongoTest;
// } mongodb

// postgresql {
const DATABASE_URL =
  process.env.NODE_ENV === "production"
    ? process.env.DATABASE_URL!
    : `postgres://${process.env.POSTGRES_USER}:${process.env.POSTGRES_PASSWORD}@${process.env.DB_HOST}:5432/${process.env.POSTGRES_DB_TEST}`;

/* eslint-disable-next-line import/prefer-default-export */
export const testSql = new Sequelize(DATABASE_URL, {
  models: [resolve(__dirname, "../models/*.model.ts")],
  logging: false,
});
// } postgresql
