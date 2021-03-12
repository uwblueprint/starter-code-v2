import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import * as firebaseAdmin from "firebase-admin";

import authRouter from "./rest/authRoutes";
import entityRouter from "./rest/entityRoutes";
import userRouter from "./rest/userRoutes";
import { mongo, sequelize } from "./models/index";
import { Entity, IEntity } from "./models/entity.mgmodel"
import EntityService, { EntityRequestDTO } from "./services/EntityService";
import { addOptions } from "sequelize-typescript";
var bodyParser = require('body-parser');

const app = express();
app.use(cookieParser());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded());

app.use("/auth", authRouter);
app.use("/entities", entityRouter);
app.use("/users", userRouter);
app.use(bodyParser.urlencoded({ extended: false }))

const entService = new EntityService();

app.get("/", async (_req, res) => {
  res.send("Hello!")
});

/* Create entity Object */
app.post("/entities/", async (_req, res) => {
  const entityObj: EntityRequestDTO = _req.body.entity;
  const IentityObj = {} as IEntity;
  IentityObj.string_field = entityObj.string_field;
  IentityObj.int_field = entityObj.int_field;
  IentityObj.enum_field = entityObj.enum_field;
  IentityObj.string_array_field = entityObj.string_array_field;
  IentityObj.bool_field = entityObj.bool_field;

  try {
    await entService.createEntity(IentityObj);
    res.send('Success')
  }
  catch (e) {
    res.status(500).send(e.message);
  }
});

/* Get all entity objects */
app.get("/entities", async (_req, res) => {
  try {
    const result = await entService.getEntities();
    res.send(result)
  }
  catch (e) {
    res.status(500).send(e.message);
  }
});

/* Get entity object by id */
app.get("/entities/:id", async (_req, res) => {
  const id: string = _req.params.id

  try {
    const result = await entService.getEntity(id);
    res.send(result)
  }
  catch (e) {
    res.status(500).send(e.message);
  }
});

/* Update entity object by id */
app.put("/entities/:id", async (_req, res) => {
  const id: string = _req.params.id;
  const entityObj: EntityRequestDTO = _req.body.entity;

  const IentityObj = {} as IEntity;
  IentityObj.string_field = entityObj.string_field;
  IentityObj.int_field = entityObj.int_field;
  IentityObj.enum_field = entityObj.enum_field;
  IentityObj.string_array_field = entityObj.string_array_field;
  IentityObj.bool_field = entityObj.bool_field;
  try {
    const result = await entService.updateEntity(id, IentityObj);
    res.send(result)
  }
  catch (e) {
    res.status(500).send(e.message);
  }
});

/* Delete entity object by id */
app.delete("/entities/:id", async (_req, res) => {
  const id: string = _req.params.id;
  try {
    entService.deleteEntity(id);
    res.send('Success')
  }
  catch (e) {
    res.status(500).send(e.message);
  }
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
