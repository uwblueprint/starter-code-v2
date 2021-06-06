import { Request, Response, NextFunction } from "express";
import isValid from "./isValid";

export const createUserDtoValidator = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (!isValid(req.body.firstName, "string")) {
    return res.sendStatus(400);
  }
  if (!isValid(req.body.lastName, "string")) {
    return res.sendStatus(400);
  }
  if (!isValid(req.body.email, "string")) {
    return res.sendStatus(400);
  }
  if (!isValid(req.body.role, "string")) {
    return res.sendStatus(400);
  }
  if (!isValid(req.body.password, "string")) {
    return res.sendStatus(400);
  }
  return next();
};

export const updateUserDtoValidator = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (!isValid(req.body.firstName, "string")) {
    return res.sendStatus(400);
  }
  if (!isValid(req.body.lastName, "string")) {
    return res.sendStatus(400);
  }
  if (!isValid(req.body.email, "string")) {
    return res.sendStatus(400);
  }
  if (!isValid(req.body.role, "string")) {
    return res.sendStatus(400);
  }
  return next();
};
