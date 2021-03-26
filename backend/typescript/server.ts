import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
<<<<<<< HEAD
import * as firebaseAdmin from "firebase-admin";

import authRouter from "./rest/authRoutes";
import entityRouter from "./rest/entityRoutes";
import userRouter from "./rest/userRoutes";
=======
import { ApolloServer } from "apollo-server-express";
>>>>>>> CRUD Functionality Complete
import { mongo, sequelize } from "./models/index";
import schema from "./graphql";

const bodyParser = require("body-parser");
const entityRouter = require("./rest/entityRoutes");

const app = express();
app.use(cookieParser());
app.use(cors());
app.use(express.json());

app.use("/auth", authRouter);
app.use("/entities", entityRouter);
app.use("/users", userRouter);
app.use(bodyParser.urlencoded({ extended: false }))

const server = new ApolloServer({ schema });

server.applyMiddleware({ app, path: "/graphql" });


app.get("/", async (_req, res) => {
  res.send("Hello!");
});

app.use("/entities", entityRouter);

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
