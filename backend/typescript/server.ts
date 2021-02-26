import cors from "cors";
import express from "express";

import { mongo, sequelize } from "./models/index";
// import PgPerson from "./models/person.pgmodel";
// import MgPerson from "./models/person.mgmodel";

const app = express();
app.use(cors());
app.use(express.json());

// app.get("/", async (_req, res) => {
//     await PgPerson.create({name: "First Last", email: "first@last.com"});
//     await MgPerson.create({name: "First Last", email: "first@last.com"});
//     res.send("Created some records!");
// });

const eraseDatabaseOnSync = false;
sequelize.sync({ force: eraseDatabaseOnSync }).then(async () => {
  mongo.connect();

  app.listen({ port: 5000 }, () => {
    /* eslint-disable-next-line no-console */
    console.info("Server is listening on port 5000!");
  });
});
