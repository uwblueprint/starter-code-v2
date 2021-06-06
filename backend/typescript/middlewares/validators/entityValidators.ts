import { Request, Response, NextFunction } from "express";
import isValid from "./isValid";

/* eslint-disable-next-line import/prefer-default-export */
export const entityRequestDtoValidator = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (!isValid(req.body.stringField, "string")) {
    return res.sendStatus(400);
  }
  if (!isValid(req.body.intField, "integer")) {
    return res.sendStatus(400);
  }
  if (!isValid(req.body.enumField, "string")) {
    return res.sendStatus(400);
  }
  if (!isValid(req.body.stringArrayField, "string-array")) {
    return res.sendStatus(400);
  }
  if (!isValid(req.body.boolField, "boolean")) {
    return res.sendStatus(400);
  }
  return next();
};
