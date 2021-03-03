import cors from "cors";
import express from "express";

import { mongo, sequelize } from "./models/index";
import Entity, { IEntity } from "./models/entity.mgmodel"
import EntityService from "./services/EntityService";
const app = express();
app.use(cors());
app.use(express.json());

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

  app.listen({ port: 5000 }, () => {
    /* eslint-disable-next-line no-console */
    console.info("Server is listening on port 5000!");
  });
});
