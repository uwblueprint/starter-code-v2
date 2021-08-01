import { parseAsync } from "json2csv";

/* eslint-disable-next-line import/prefer-default-export */
export const generateCSV = async (
  data: Array<{ [key: string]: any }>,
): Promise<string> => {
  return parseAsync(data);
};
