import cors from "cors";
import express from "express";
import * as firebaseAdmin from "firebase-admin";

import { mongo, sequelize } from "./models";

/** ***************************************************************************
 * TEMPORARY: UserService test endpoints
 *************************************************************************** */
import UserService from "./services/implementations/userService";
import IUserService from "./services/interfaces/userService";

const app = express();
app.use(cors());
app.use(express.json());

const userService: IUserService = new UserService();

app.get("/create-user/:firstName/:lastName", async (req, res) => {
  const newUser = await userService.createUser({
    firstName: req.params.firstName,
    lastName: req.params.lastName,
    email: `${req.params.firstName}@${req.params.lastName}.com`,
    role: "User",
    password: "s3cur3p455w0rd",
  });
  res.status(200).json(newUser);
});

app.get("/update-user/:userId", async (req, res) => {
  const updatedUser = await userService.updateUserById(req.params.userId, {
    firstName: "Updated",
    lastName: "User",
    email: "updated@user.org",
    role: "User",
  });
  res.status(200).json(updatedUser);
});

app.get("/get-user-by-id/:userId", async (req, res) => {
  const user = await userService.getUserById(req.params.userId);
  res.status(200).json(user);
});

app.get("/get-user-by-email/:email", async (req, res) => {
  const user = await userService.getUserByEmail(req.params.email);
  res.status(200).json(user);
});

app.get("/get-users", async (req, res) => {
  const users = await userService.getUsers();
  res.status(200).json(users);
});

app.get("/delete-user-by-id/:userId", async (req, res) => {
  await userService.deleteUserById(req.params.userId);
  res.status(204).send();
});

app.get("/delete-user-by-email/:email", async (req, res) => {
  await userService.deleteUserByEmail(req.params.email);
  res.status(204).send();
});
/** ************************************************************************ */

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
