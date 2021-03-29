import cors from "cors";
import express from "express";
import * as firebaseAdmin from "firebase-admin";

import { mongo, sequelize } from "./models";
import entityRouter from "./rest/entityRoutes";
import userRouter from "./rest/userRoutes";

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded());

app.use("/entities", entityRouter);
app.use("/users", userRouter);

const eraseDatabaseOnSync = false;
sequelize.sync({ force: eraseDatabaseOnSync }).then(async () => {
  mongo.connect();

  firebaseAdmin.initializeApp({
    credential: firebaseAdmin.credential.applicationDefault(),
  });

  app.listen({ port: 5000 }, () => {
    /* eslint-disable-next-line no-console */
    console.info("Server is listening on port 5000!");
  });
});
