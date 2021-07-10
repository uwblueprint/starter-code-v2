import { Request, Response, NextFunction } from "express";
import {
  getApiValidationError,
  getFileTypeValidationError,
  validateArray,
  validateFileType,
  validatePrimitive,
} from "./util";

/* eslint-disable-next-line import/prefer-default-export */
export const entityRequestDtoValidator = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (!validatePrimitive(req.body.stringField, "string")) {
    return res.status(400).send(getApiValidationError("stringField", "string"));
  }
  if (!validatePrimitive(req.body.intField, "integer")) {
    return res.status(400).send(getApiValidationError("intField", "integer"));
  }
  if (!validatePrimitive(req.body.enumField, "string")) {
    return res.status(400).send(getApiValidationError("enumField", "string"));
  }
  if (!validateArray(req.body.stringArrayField, "string")) {
    return res
      .status(400)
      .send(getApiValidationError("stringArrayField", "string", true));
  }
  if (!validatePrimitive(req.body.boolField, "boolean")) {
    return res.status(400).send(getApiValidationError("boolField", "boolean"));
  }
  if (req.file && !validateFileType(req.file.mimetype)) {
    return res.status(400).send(getFileTypeValidationError(req.file.mimetype));
  }
  return next();
};
