import { Request, Response, NextFunction } from "express";
import {
  getApiValidationError,
  // file-storage {
  getFileTypeValidationError,
  // } file-storage
  validateArray,
  // file-storage {
  validateFileType,
  // } file-storage
  validatePrimitive,
} from "./util";

/* eslint-disable-next-line import/prefer-default-export */
export const entityRequestDtoValidator = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // file-storage {
  let body;
  try {
    body = JSON.parse(req.body.body);
  } catch (e) {
    return res.status(400).send(e.message);
  }
  // } file-storage
  // no-file-storage {
  const { body } = req;
  // } no-file-storage
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
  // file-storage {
  if (req.file && !validateFileType(req.file.mimetype)) {
    return res.status(400).send(getFileTypeValidationError(req.file.mimetype));
  }
  // } file-storage
  return next();
};
