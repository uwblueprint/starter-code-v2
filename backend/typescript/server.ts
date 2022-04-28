import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
// auth {
import * as firebaseAdmin from "firebase-admin";
// } auth
// no-auth {
// file-storage {
import * as firebaseAdmin from "firebase-admin";
// } file-storage
// } no-auth
// rest {
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";
// } rest

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
import simpleEntityRouter from "./rest/simpleEntityRoutes";
// auth {
import userRouter from "./rest/userRoutes";
// } auth

// } rest
// graphql {
import schema from "./graphql";

// } graphql
const CORS_ALLOW_LIST = [
  "http://localhost:3000",
  "https://uw-blueprint-starter-code.firebaseapp.com",
  "https://uw-blueprint-starter-code.web.app",
  /^https:\/\/uw-blueprint-starter-code--pr.*\.web\.app$/,
];

const CORS_OPTIONS: cors.CorsOptions = {
  origin: CORS_ALLOW_LIST,
  credentials: true,
};

// rest {
const swaggerDocument = YAML.load("swagger.yml");
// } rest

const app = express();
app.use(cookieParser());
app.use(cors(CORS_OPTIONS));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// rest {
// auth {
app.use("/auth", authRouter);
// } auth
app.use("/entities", entityRouter);
app.use("/simple-entities", simpleEntityRouter);
// auth {
app.use("/users", userRouter);
// } auth
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

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
sequelize.authenticate();

// } postgresql
// mongodb {
mongo.connect();

// } mongodb
// auth {
firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    privateKey: process.env.FIREBASE_SVC_ACCOUNT_PRIVATE_KEY?.replace(
      /\\n/g,
      "\n",
    ),
    clientEmail: process.env.FIREBASE_SVC_ACCOUNT_CLIENT_EMAIL,
  }),
});

// } auth
// no-auth {
// file-storage {
firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    privateKey: process.env.FIREBASE_SVC_ACCOUNT_PRIVATE_KEY?.replace(
      /\\n/g,
      "\n",
    ),
    clientEmail: process.env.FIREBASE_SVC_ACCOUNT_CLIENT_EMAIL,
  }),
});

// } file-storage
// } no-auth
app.listen({ port: process.env.PORT || 5000 }, () => {
  /* eslint-disable-next-line no-console */
  console.info(`Server is listening on port ${process.env.PORT || 5000}!`);
});
