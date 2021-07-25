import { Response } from "express";
import { generateCSV } from "./generateCsv";

export const setResponseByMimeType = (
  res: Response,
  responseCode: number,
  data: string,
  contentType: string,
  error?: any,
): Response => {
  if (contentType === "text/csv") {
    const csvText = generateCSV(data);
    return res.status(responseCode).send(csvText);
  } else if (contentType === "text/csv" || contentType === "text/csv")
    return res.status(415).json({ error: error.message });
};

export default setResponseByMimeType;
