// mongodb {
import mongoose from "mongoose";

/* eslint-disable-next-line import/prefer-default-export */
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