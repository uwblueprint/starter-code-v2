import { Router } from "express";

import { isAuthorizedByEmail, isAuthorizedByUserId } from "../middlewares/auth";
// import nodemailerConfig from "../nodemailer.config";
import AuthService from "../services/implementations/authService";
import EmailService from "../services/implementations/emailService";
import UserService from "../services/implementations/userService";
import IAuthService from "../services/interfaces/authService";
import IEmailService from "../services/interfaces/emailService";

const authRouter: Router = Router();
// const emailService: IEmailService = new EmailService(nodemailerConfig);
const authService: IAuthService = new AuthService(new UserService(), null);

/* Returns access token and user info in response body and sets refreshToken as an httpOnly cookie */
authRouter.post("/login", async (req, res) => {
  try {
    const authDTO = await authService.generateToken(
      req.body.email,
      req.body.password,
    );
    const { refreshToken, ...rest } = authDTO;

    res
      .cookie("refreshToken", refreshToken, {
        httpOnly: true,
        sameSite: "strict",
        secure: process.env.NODE_ENV === "production",
      })
      .status(200)
      .json(rest);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/* Returns access token in response body and sets refreshToken as an httpOnly cookie */
authRouter.post("/refresh", async (req, res) => {
  try {
    const token = await authService.renewToken(req.cookies.refreshToken);

    res
      .cookie("refreshToken", token.refreshToken, {
        httpOnly: true,
        sameSite: "strict",
        secure: process.env.NODE_ENV === "production",
      })
      .status(200)
      .json({ accessToken: token.accessToken });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/* Revokes all of the specified user's refresh tokens */
authRouter.post(
  "/logout/:userId",
  isAuthorizedByUserId("userId"),
  async (req, res) => {
    try {
      await authService.revokeTokens(req.params.userId);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
);

/* Emails a password reset link to the user with the specified email */
authRouter.post(
  "/resetPassword/:email",
  isAuthorizedByEmail("email"),
  async (req, res) => {
    try {
      await authService.resetPassword(req.params.email);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
);

export default authRouter;
