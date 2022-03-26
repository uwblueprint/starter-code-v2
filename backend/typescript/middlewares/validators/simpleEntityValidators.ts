import { Request, Response, NextFunction } from "express";
import {
  getApiValidationError,
  validateArray,
  validatePrimitive,
} from "./util";

/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable-next-line import/prefer-default-export */
export const simpleEntityRequestDtoValidator = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { body } = req;
  if (!validatePrimitive(body.stringField, "string")) {
    return res.status(400).send(getApiValidationError("stringField", "string"));
  }
  if (!validatePrimitive(body.intField, "integer")) {
    return res.status(400).send(getApiValidationError("intField", "integer"));
  }
  if (!validatePrimitive(body.enumField, "string")) {
    return res.status(400).send(getApiValidationError("enumField", "string"));
  }
  if (!validateArray(body.stringArrayField, "string")) {
    return res
      .status(400)
      .send(getApiValidationError("stringArrayField", "string", true));
  }
  if (!validatePrimitive(body.boolField, "boolean")) {
    return res.status(400).send(getApiValidationError("boolField", "boolean"));
  }
  return next();
};
