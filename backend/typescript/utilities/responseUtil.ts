import { Response } from "express";
import { generateCSV } from "./CSVUtils";

/* eslint-disable-next-line import/prefer-default-export */
export const setResponseByMimeType = async (
  res: Response,
  responseCode: number,
  contentType: string | undefined,
  data: Array<{ [key: string]: any }>,
): Promise<Response> => {
  if (contentType === "text/csv") {
    const csvText = await generateCSV(data);
    return res.status(responseCode).type("text/csv").send(csvText);
  }
  if (contentType === "application/json" || contentType === undefined) {
    return res.status(responseCode).json(data);
  }
  return res.status(415).json(data);
};
