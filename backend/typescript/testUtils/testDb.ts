// mongodb {
import mongoose from "mongoose";
// } mongodb

// mongodb {
// eslint-disable-next-line import/no-extraneous-dependencies
import { MongoMemoryServer } from "mongodb-memory-server";
// } mongodb

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
