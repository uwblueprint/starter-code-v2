import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
// auth {
import * as firebaseAdmin from "firebase-admin";
// } auth

// graphql {
import { ApolloServer } from "apollo-server-express";
// } graphql
// mongodb {
import { mongo } from "./models";
// } mongodb
// postgresql {
import { sequelize } from "./models";
// } postgresql
// rest {
// auth {
import authRouter from "./rest/authRoutes";
// } auth
import entityRouter from "./rest/entityRoutes";
// auth {
import userRouter from "./rest/userRoutes";
// } auth

// } rest
// graphql {
import schema from "./graphql";

// } graphql
const CORS_ALLOW_LIST = ["http://localhost:3000"];

const CORS_OPTIONS: cors.CorsOptions = {
  origin: CORS_ALLOW_LIST,
  credentials: true,
};

const app = express();
app.use(cookieParser());
app.use(cors(CORS_OPTIONS));
app.use(express.json());
app.use(express.urlencoded());

// rest {
// auth {
app.use("/auth", authRouter);
// } auth
app.use("/entities", entityRouter);
// auth {
app.use("/users", userRouter);
// } auth

// } rest
// graphql {
const server = new ApolloServer({
  schema,
  context: ({ req, res }) => ({ req, res }),
  playground: {
    settings: {
      "request.credentials": "include",
    },
  },
});

server.applyMiddleware({
  app,
  path: "/graphql",
  cors: { origin: CORS_ALLOW_LIST, credentials: true },
});

// } graphql
// postgresql {
const eraseDatabaseOnSync = false;
sequelize.sync({ force: eraseDatabaseOnSync });

// } postgresql
// mongodb {
mongo.connect();

// } mongodb
// auth {
firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.applicationDefault(),
});

// } auth
app.listen({ port: 5000 }, () => {
  /* eslint-disable-next-line no-console */
  console.info("Server is listening on port 5000!");
});
