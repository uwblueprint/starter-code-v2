import { CookieOptions, Request, Response } from "express";

import nodemailerConfig from "../../nodemailer.config";
import AuthService from "../../services/implementations/authService";
import EmailService from "../../services/implementations/emailService";
import UserService from "../../services/implementations/userService";
import IAuthService from "../../services/interfaces/authService";
import IEmailService from "../../services/interfaces/emailService";
import IUserService from "../../services/interfaces/userService";
import { RegisterUserDTO } from "../../types";

const userService: IUserService = new UserService();
const emailService: IEmailService = new EmailService(nodemailerConfig);
const authService: IAuthService = new AuthService(userService, emailService);

const cookieOptions: CookieOptions = {
  httpOnly: true,
  sameSite: "strict",
  secure: process.env.NODE_ENV === "production",
};

const authResolvers = {
  Mutation: {
    login: async (
      _parent: any,
      { email, password }: { email: string; password: string },
      { res }: { res: Response },
    ) => {
      const authDTO = await authService.generateToken(email, password);
      const { refreshToken, ...rest } = authDTO;
      res.cookie("refreshToken", refreshToken, cookieOptions);
      return rest;
    },
    loginWithGoogle: async (
      _parent: any,
      { idToken }: { idToken: string },
      { res }: { res: Response },
    ) => {
      const authDTO = await authService.generateTokenOAuth(idToken);
      const { refreshToken, ...rest } = authDTO;
      res.cookie("refreshToken", refreshToken, cookieOptions);
      return rest;
    },
    register: async (
      _parent: any,
      { user }: { user: RegisterUserDTO },
      { res }: { res: Response },
    ) => {
      await userService.createUser({ ...user, role: "User" });
      const authDTO = await authService.generateToken(
        user.email,
        user.password,
      );
      const { refreshToken, ...rest } = authDTO;
      await authService.sendEmailVerificationLink(user.email);
      res.cookie("refreshToken", refreshToken, cookieOptions);
      return rest;
    },
    refresh: async (
      _parent: any,
      _args: any,
      { req, res }: { req: Request; res: Response },
    ) => {
      const token = await authService.renewToken(req.cookies.refreshToken);
      res.cookie("refreshToken", token.refreshToken, cookieOptions);
      return token.accessToken;
    },
    logout: async (_parent: any, { userId }: { userId: string }) => {
      await authService.revokeTokens(userId);
    },
    resetPassword: async (_parent: any, { email }: { email: string }) => {
      await authService.resetPassword(email);
      return true;
    },
  },
};

export default authResolvers;
