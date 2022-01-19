import { CookieOptions, Router } from "express";

import { isAuthorizedByEmail, isAuthorizedByUserId } from "../middlewares/auth";
import {
  loginRequestValidator,
  registerRequestValidator,
} from "../middlewares/validators/authValidators";
import nodemailerConfig from "../nodemailer.config";
import AuthService from "../services/implementations/authService";
import EmailService from "../services/implementations/emailService";
import UserService from "../services/implementations/userService";
import IAuthService from "../services/interfaces/authService";
import IEmailService from "../services/interfaces/emailService";
import IUserService from "../services/interfaces/userService";
import { getErrorMessage } from "../utilities/errorUtils";

const authRouter: Router = Router();
const userService: IUserService = new UserService();
const emailService: IEmailService = new EmailService(nodemailerConfig);
const authService: IAuthService = new AuthService(userService, emailService);

const cookieOptions: CookieOptions = {
  httpOnly: true,
  sameSite: process.env.PREVIEW_DEPLOY ? "none" : "strict",
  secure: process.env.NODE_ENV === "production",
};

/* Returns access token and user info in response body and sets refreshToken as an httpOnly cookie */
authRouter.post("/login", loginRequestValidator, async (req, res) => {
  try {
    const authDTO = req.body.idToken
      ? // OAuth
        await authService.generateTokenOAuth(req.body.idToken)
      : await authService.generateToken(req.body.email, req.body.password);

    const { refreshToken, ...rest } = authDTO;

    res
      .cookie("refreshToken", refreshToken, cookieOptions)
      .status(200)
      .json(rest);
  } catch (error: unknown) {
    res.status(500).json({ error: getErrorMessage(error) });
  }
});

/* Register a user, returns access token and user info in response body and sets refreshToken as an httpOnly cookie */
authRouter.post("/register", registerRequestValidator, async (req, res) => {
  try {
    await userService.createUser({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      role: "User",
      password: req.body.password,
    });

    const authDTO = await authService.generateToken(
      req.body.email,
      req.body.password,
    );
    const { refreshToken, ...rest } = authDTO;

    await authService.sendEmailVerificationLink(req.body.email);

    res
      .cookie("refreshToken", refreshToken, cookieOptions)
      .status(200)
      .json(rest);
  } catch (error: unknown) {
    res.status(500).json({ error: getErrorMessage(error) });
  }
});

/* Returns access token in response body and sets refreshToken as an httpOnly cookie */
authRouter.post("/refresh", async (req, res) => {
  try {
    const token = await authService.renewToken(req.cookies.refreshToken);

    res
      .cookie("refreshToken", token.refreshToken, cookieOptions)
      .status(200)
      .json({ accessToken: token.accessToken });
  } catch (error: unknown) {
    res.status(500).json({ error: getErrorMessage(error) });
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
    } catch (error: unknown) {
      res.status(500).json({ error: getErrorMessage(error) });
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
    } catch (error: unknown) {
      res.status(500).json({ error: getErrorMessage(error) });
    }
  },
);

export default authRouter;
