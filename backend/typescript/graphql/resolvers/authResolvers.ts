import { CookieOptions, Request, Response } from "express";

import nodemailerConfig from "../../nodemailer.config";
import AuthService from "../../services/implementations/authService";
import EmailService from "../../services/implementations/emailService";
import UserService from "../../services/implementations/userService";
import IAuthService from "../../services/interfaces/authService";
import IEmailService from "../../services/interfaces/emailService";
import IUserService from "../../services/interfaces/userService";
import { AuthDTO, RegisterUserDTO } from "../../types";

const userService: IUserService = new UserService();
const emailService: IEmailService = new EmailService(nodemailerConfig);
const authService: IAuthService = new AuthService(userService, emailService);

const cookieOptions: CookieOptions = {
  httpOnly: true,
  sameSite: process.env.PREVIEW_DEPLOY ? "none" : "strict",
  secure: process.env.NODE_ENV === "production",
};

const authResolvers = {
  Mutation: {
    login: async (
      _parent: undefined,
      { email, password }: { email: string; password: string },
      { res }: { res: Response },
    ): Promise<Omit<AuthDTO, "refreshToken">> => {
      const authDTO = await authService.generateToken(email, password);
      const { refreshToken, ...rest } = authDTO;
      res.cookie("refreshToken", refreshToken, cookieOptions);
      return rest;
    },
    loginWithGoogle: async (
      _parent: undefined,
      { idToken }: { idToken: string },
      { res }: { res: Response },
    ): Promise<Omit<AuthDTO, "refreshToken">> => {
      const authDTO = await authService.generateTokenOAuth(idToken);
      const { refreshToken, ...rest } = authDTO;
      res.cookie("refreshToken", refreshToken, cookieOptions);
      return rest;
    },
    register: async (
      _parent: undefined,
      { user }: { user: RegisterUserDTO },
      { res }: { res: Response },
    ): Promise<Omit<AuthDTO, "refreshToken">> => {
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
      _parent: undefined,
      _args: Record<string, undefined>,
      { req, res }: { req: Request; res: Response },
    ): Promise<string> => {
      const token = await authService.renewToken(req.cookies.refreshToken);
      res.cookie("refreshToken", token.refreshToken, cookieOptions);
      return token.accessToken;
    },
    logout: async (
      _parent: undefined,
      { userId }: { userId: string },
    ): Promise<void> => {
      await authService.revokeTokens(userId);
    },
    resetPassword: async (
      _parent: undefined,
      { email }: { email: string },
    ): Promise<boolean> => {
      await authService.resetPassword(email);
      return true;
    },
  },
};

export default authResolvers;
