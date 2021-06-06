import { Request, Response, NextFunction } from "express";
import isValid from "./isValid";

/* eslint-disable-next-line import/prefer-default-export */
export const loginRequestValidator = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (!isValid(req.body.email, "string")) {
    return res.sendStatus(400);
  }
  if (!isValid(req.body.password, "string")) {
    return res.sendStatus(400);
  }
  return next();
};
