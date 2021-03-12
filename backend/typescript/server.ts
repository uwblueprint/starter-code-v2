import cors from "cors";
import express from "express";
import { mongo, sequelize } from "./models/index";
import { Entity, IEntity } from "./models/entity.mgmodel"
import EntityService from "./services/EntityService";
import { addOptions } from "sequelize-typescript";
var bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }))

const entService = new EntityService();

app.get("/", async (_req, res) => {
  // await MgPerson.create({ name: "First Last", email: "first@last.com" });
  // await Entity.create({ string_field: "test", int_field: 7, enum_field: 'A', string_array_field: ["test"], bool_field: false })
  // const entity: IEntity = await Entity.create({
  //   string_field: 'test',
  //   int_field: 7,
  //   enum_field: 'B',
  //   string_array_field: ['A'],
  //   bool_field: false,

  // })
});

app.post("/entities/", async (_req, res) => {
  const obj: IEntity = _req.body.entity;
  try {
    entService.createEntity(obj);
    res.send('Success')
  }
  catch (e) {
    res.status(500).send(e.message);
  }
});

app.get("/entities", async (_req, res) => {
  try {
    const result = await entService.getEntities();
    res.send(result)
  }
  catch (e) {
    res.status(500).send(e.message);
  }
});

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

app.put("/entities/:id", async (_req, res) => {
  const id: string = _req.params.id

  try {
    const result = await entService.getEntity(id);
    res.send(result)
  }
  catch (e) {
    res.status(500).send(e.message);
  }
});

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

  app.listen({ port: 5000 }, () => {
    /* eslint-disable-next-line no-console */
    console.info("Server is listening on port 5000!");
  });
});
