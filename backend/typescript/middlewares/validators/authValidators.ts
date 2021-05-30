import { Request, Response, NextFunction } from "express";

/* eslint-disable-next-line import/prefer-default-export */
export const loginRequestValidator = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (
    req.body.email === undefined ||
    req.body.email === null ||
    typeof req.body.email !== "string"
  ) {
    return res.sendStatus(400);
  }
  if (
    req.body.password === undefined ||
    req.body.password === null ||
    typeof req.body.password !== "string"
  ) {
    return res.sendStatus(400);
  }
  return next();
};
