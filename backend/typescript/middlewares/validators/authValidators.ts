import { Request, Response, NextFunction } from "express";
import { getApiValidationError, validatePrimitive } from "./util";

/* eslint-disable-next-line import/prefer-default-export */
export const loginRequestValidator = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (req.body.id_token) {
    if (!validatePrimitive(req.body.id_token, "string")) {
      return res.status(400).json(getApiValidationError("id_token", "string"));
    }
  } else {
    if (!validatePrimitive(req.body.email, "string")) {
      return res.status(400).send(getApiValidationError("email", "string"));
    }
    if (!validatePrimitive(req.body.password, "string")) {
      return res.status(400).send(getApiValidationError("password", "string"));
    }
  }
  return next();
};
