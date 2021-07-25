import { Response } from "express";
import { generateCSV } from "./CSVUtils";

export const setResponseByMimeType = (
  res: Response,
  responseCode: number,
  contentType: string | undefined,
  data: Array<{ [key: string]: any }>,
): Response => {
  if (contentType === "text/csv") {
    const csvText = generateCSV(data);
    return res.status(responseCode).send(csvText);
  }
  if (contentType === "application/json" || contentType === "*/*") {
    return res.status(responseCode).json(data);
  }
  return res.status(415).json(data);
};

export default setResponseByMimeType;
