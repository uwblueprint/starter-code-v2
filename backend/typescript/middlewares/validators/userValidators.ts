import { Request, Response, NextFunction } from "express";
import { validatePrimitive } from "./util";

export const createUserDtoValidator = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (!validatePrimitive(req.body.firstName, "string")) {
    return res.sendStatus(400);
  }
  if (!validatePrimitive(req.body.lastName, "string")) {
    return res.sendStatus(400);
  }
  if (!validatePrimitive(req.body.email, "string")) {
    return res.sendStatus(400);
  }
  if (!validatePrimitive(req.body.role, "string")) {
    return res.sendStatus(400);
  }
  if (!validatePrimitive(req.body.password, "string")) {
    return res.sendStatus(400);
  }
  return next();
};

export const updateUserDtoValidator = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (!validatePrimitive(req.body.firstName, "string")) {
    return res.sendStatus(400);
  }
  if (!validatePrimitive(req.body.lastName, "string")) {
    return res.sendStatus(400);
  }
  if (!validatePrimitive(req.body.email, "string")) {
    return res.sendStatus(400);
  }
  if (!validatePrimitive(req.body.role, "string")) {
    return res.sendStatus(400);
  }
  return next();
};
