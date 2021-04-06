import { Router } from "express";

import { isAuthorizedByRole } from "../middlewares/auth";
import UserService from "../services/implementations/userService";
import IUserService from "../services/interfaces/userService";

const userRouter: Router = Router();
userRouter.use(isAuthorizedByRole(new Set(["Admin"])));

const userService: IUserService = new UserService();

/* Get all users, optionally filter by a userId or email query parameter to retrieve a single user */
userRouter.get("/", async (req, res) => {
  const { userId, email } = req.query;

  if (userId && email) {
    res.status(400).json({ error: "Cannot query by both userId and email." });
    return;
  }

  if (!userId && !email) {
    try {
      const users = await userService.getUsers();
      res.status(200).json(users);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
    return;
  }

  if (userId) {
    if (typeof userId !== "string") {
      res
        .status(400)
        .json({ error: "userId query parameter must be a string." });
    } else {
      try {
        const user = await userService.getUserById(userId);
        res.status(200).json(user);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    }
    return;
  }

  if (email) {
    if (typeof email !== "string") {
      res
        .status(400)
        .json({ error: "email query parameter must be a string." });
    } else {
      try {
        const user = await userService.getUserByEmail(email);
        res.status(200).json(user);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    }
  }
});

/* Create a user */
userRouter.post("/", async (req, res) => {
  try {
    const newUser = await userService.createUser({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      role: req.body.role,
      password: req.body.password,
    });
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/* Update the user with the specified userId */
userRouter.put("/:userId", async (req, res) => {
  try {
    const updatedUser = await userService.updateUserById(req.params.userId, {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      role: req.body.role,
    });
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/* Delete a user by userId or email, specified through a query parameter */
userRouter.delete("/", async (req, res) => {
  const { userId, email } = req.query;

  if (userId && email) {
    res.status(400).json({ error: "Cannot delete by both userId and email." });
    return;
  }

  if (userId) {
    if (typeof userId !== "string") {
      res
        .status(400)
        .json({ error: "userId query parameter must be a string." });
    } else {
      try {
        await userService.deleteUserById(userId);
        res.status(204).send();
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    }
    return;
  }

  if (email) {
    if (typeof email !== "string") {
      res
        .status(400)
        .json({ error: "email query parameter must be a string." });
    } else {
      try {
        await userService.deleteUserByEmail(email);
        res.status(204).send();
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    }
    return;
  }

  res
    .status(400)
    .json({ error: "Must supply one of userId or email as query parameter." });
});

export default userRouter;
