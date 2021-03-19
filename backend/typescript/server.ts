import cors from "cors";
import express from "express";
import { mongo, sequelize } from "./models/index";
import { addOptions } from "sequelize-typescript";
var bodyParser = require('body-parser');

const entityRouter = require('./rest/entityRoutes');


const app = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }))


app.get("/", async (_req, res) => {
  res.send("Hello!")
});


app.use("/entities", entityRouter);

const eraseDatabaseOnSync = false;
sequelize.sync({ force: eraseDatabaseOnSync }).then(async () => {
  mongo.connect();

  app.listen({ port: 5000 }, () => {
    /* eslint-disable-next-line no-console */
    console.info("Server is listening on port 5000!");
  });
});
