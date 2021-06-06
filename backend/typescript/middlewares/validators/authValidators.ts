import { Request, Response, NextFunction } from "express";
import { validatePrimitive } from "./util";

/* eslint-disable-next-line import/prefer-default-export */
export const loginRequestValidator = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (!validatePrimitive(req.body.email, "string")) {
    return res.sendStatus(400);
  }
  if (!validatePrimitive(req.body.password, "string")) {
    return res.sendStatus(400);
  }
  return next();
};
