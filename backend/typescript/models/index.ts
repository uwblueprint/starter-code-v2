// postgresql {
import * as path from "path";
import { Sequelize } from "sequelize-typescript";

const DATABASE_URL =
  process.env.NODE_ENV === "production"
    ? process.env.DATABASE_URL!
    : `postgres://${process.env.POSTGRES_USER}:${process.env.POSTGRES_PASSWORD}@${process.env.DB_HOST}:5432/${process.env.POSTGRES_DB_DEV}`;

export const sequelize = new Sequelize(DATABASE_URL, {
  models: [path.join(__dirname, "/*.model.ts")],
});

// } postgresql
// mongodb {
import mongoose from "mongoose";

export const mongo = {
  connect: (): void => {
    mongoose.connect(
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      encodeURI(process.env.MG_DATABASE_URL!),
      {
        useUnifiedTopology: true,
        useNewUrlParser: true,
        useFindAndModify: false,
      },
      (error) => {
        if (error) {
          /* eslint-disable-next-line no-console */
          console.error(`Error connecting to MongoDB: ${error.message}`);
        } else {
          /* eslint-disable-next-line no-console */
          console.info("Successfully connected to MongoDB!");
        }
      },
    );
  },
};

// } mongodb