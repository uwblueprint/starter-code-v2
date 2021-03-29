import { Router } from "express";

import AuthService from "../services/implementations/authService";
import IAuthService from "../services/interfaces/authService";

const authRouter: Router = Router();
const authService: IAuthService = new AuthService();

/* Returns access token in response body and sets refreshToken as an httpOnly cookie */
authRouter.post("/login", async (req, res) => {
  try {
    const token = await authService.generateToken(
      req.body.email,
      req.body.password,
    );

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
authRouter.post("/logout/:userId", async (req, res) => {
  try {
    await authService.revokeTokens(req.params.userId);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/* Returns a password reset link for the user with the specified email */
/* TODO: actually send reset link in an email */
authRouter.post("/resetPassword/:email", async (req, res) => {
  try {
    const resetLink = await authService.generatePasswordResetLink(
      req.params.email,
    );
    res.status(200).json({ resetLink });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default authRouter;
