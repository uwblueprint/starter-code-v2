import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import * as firebaseAdmin from "firebase-admin";

import { mongo, sequelize } from "./models";
import authRouter from "./rest/authRoutes";
import entityRouter from "./rest/entityRoutes";
import userRouter from "./rest/userRoutes";
import Entity, { IEntity } from "./models/entity.mgmodel"
import EntityService from "./services/EntityService";

const app = express();
app.use(cookieParser());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded());

app.use("/auth", authRouter);
app.use("/entities", entityRouter);
app.use("/users", userRouter);
app.get("/", async (_req, res) => {
  // await MgPerson.create({ name: "First Last", email: "first@last.com" });
  // await Entity.create({ string_field: "test", int_field: 7, enum_field: 'A', string_array_field: ["test"], bool_field: false })
  const test = new EntityService();
  const results = await test.getEntities();
  res.send(results);
});

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
