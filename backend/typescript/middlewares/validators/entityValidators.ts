import { Request, Response, NextFunction } from "express";
import { validateArray, validatePrimitive } from "./util";

/* eslint-disable-next-line import/prefer-default-export */
export const entityRequestDtoValidator = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (!validatePrimitive(req.body.stringField, "string")) {
    return res.sendStatus(400);
  }
  if (!validatePrimitive(req.body.intField, "integer")) {
    return res.sendStatus(400);
  }
  if (!validatePrimitive(req.body.enumField, "string")) {
    return res.sendStatus(400);
  }
  if (!validateArray(req.body.stringArrayField, "string")) {
    return res.sendStatus(400);
  }
  if (!validatePrimitive(req.body.boolField, "boolean")) {
    return res.sendStatus(400);
  }
  return next();
};
