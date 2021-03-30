import { NextFunction, Request, Response } from "express";

import AuthService from "../services/implementations/authService";
import IAuthService from "../services/interfaces/authService";
import { Role } from "../types";

const authService: IAuthService = new AuthService();

const getAccessToken = (req: Request) => {
  const authHeaderParts = req.headers.authorization?.split(" ");
  if (
    authHeaderParts &&
    authHeaderParts.length >= 2 &&
    authHeaderParts[0].toLowerCase() === "bearer"
  ) {
    return authHeaderParts[1];
  }
  return null;
};

const isAuthorized = (roles: Set<Role>) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const accessToken = getAccessToken(req);
    const authorized =
      accessToken && (await authService.isAuthorized(accessToken, roles));
    if (!authorized) {
      return res
        .status(401)
        .json({ error: "You are not authorized to make this request." });
    }
    return next();
  };
};

export default isAuthorized;
