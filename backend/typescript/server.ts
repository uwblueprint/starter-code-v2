import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import * as firebaseAdmin from "firebase-admin";
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
import authRouter from "./rest/authRoutes";
import entityRouter from "./rest/entityRoutes";
import simpleEntityRouter from "./rest/simpleEntityRoutes";
import userRouter from "./rest/userRoutes";

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
app.use("/auth", authRouter);
app.use("/entities", entityRouter);
app.use("/simple-entities", simpleEntityRouter);
app.use("/users", userRouter);
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

app.listen({ port: process.env.PORT || 8080 }, () => {
  /* eslint-disable-next-line no-console */
  console.info(`Server is listening on port ${process.env.PORT || 8080}!`);
});
