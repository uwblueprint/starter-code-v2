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
      await Promise.all(promises);
    },
  };
  
  export default mongoTest;
  // } mongodb
  
  // postgresql {
  /* eslint-disable-next-line import/prefer-default-export */
  export const testSql = new Sequelize(
    `postgres://${process.env.POSTGRES_USER}:${process.env.POSTGRES_PASSWORD}@${process.env.DB_TEST_HOST}:5432/${process.env.POSTGRES_DB}`,
    { models: [resolve(__dirname, "../models/*.model.ts")], logging: false },
  );
  // } postgresql
  