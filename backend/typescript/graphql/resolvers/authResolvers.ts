import { CookieOptions, Request, Response } from "express";

import AuthService from "../../services/implementations/authService";
import IAuthService from "../../services/interfaces/authService";

const authService: IAuthService = new AuthService();

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
      const token = await authService.generateToken(email, password);
      res.cookie("refreshToken", token.refreshToken, cookieOptions);
      return token.accessToken;
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
      return authService.generatePasswordResetLink(email);
    },
  },
};

export default authResolvers;
