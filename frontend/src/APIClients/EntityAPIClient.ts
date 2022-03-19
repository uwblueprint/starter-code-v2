import baseAPIClient from "./BaseAPIClient";
import AUTHENTICATED_USER_KEY from "../constants/AuthConstants";
import { getLocalStorageObjProperty } from "../utils/LocalStorageUtils";


/* 
See in-line comments on how to remove auth if you are not using it 

Look for comments that start with "NoAuth" and follow instructions

If you are using Auth you can remove these comments
*/ 

enum EnumField {
  "A",
  "B",
  "C",
  "D",
}

export type EntityRequest = {
  stringField: string;
  intField: number;
  stringArrayField: string[];
  enumField: EnumField;
  boolField: boolean;
};

export type EntityResponse = {
  id: string | number;
  stringField: string;
  intField: number;
  stringArrayField: string[];
  enumField: EnumField;
  boolField: boolean;
  fileName: string;
};

const create = async ({
  formData,
}: {
  formData: EntityRequest | FormData;
}): Promise<EntityResponse> => {

  // NoAuth: Remove bearer token
  const bearerToken = `Bearer ${getLocalStorageObjProperty(
    AUTHENTICATED_USER_KEY,
    "accessToken",
  )}`;

  try {
    // NoAuth: Use option 2 for data variable
    const { data } = await baseAPIClient.post("/entities", formData, {
      headers: { Authorization: bearerToken },
    });
    // const { data } = await baseAPIClient.post("/entities", formData);

    return data;
  } catch (error) {
    return error;
  }
};

const get = async (): Promise<EntityResponse[]> => {
  // NoAuth: Remove bearer token
  const bearerToken = `Bearer ${getLocalStorageObjProperty(
    AUTHENTICATED_USER_KEY,
    "accessToken",
  )}`;
  try {
    // NoAuth: Use option 2 for data variable
    const { data } = await baseAPIClient.get("/entities", {
      headers: { Authorization: bearerToken },
    });
    // const { data } = await baseAPIClient.get("/entities");
    return data;
  } catch (error) {
    return error;
  }
};

const getFile = async (uuid: string): Promise<string> => {
  // NoAuth: Remove bearer token
  const bearerToken = `Bearer ${getLocalStorageObjProperty(
    AUTHENTICATED_USER_KEY,
    "accessToken",
  )}`;
  try {
    // NoAuth: Use option 2 for data variable
    const { data } = await baseAPIClient.get(`/entities/files/${uuid}`, {
      headers: { Authorization: bearerToken },
    });
    // const { data } = await baseAPIClient.get(`/entities/files/${uuid}`);
    return data.fileURL || data.fileUrl;
  } catch (error) {
    return error;
  }
};

const getCSV = async (): Promise<string> => {
  // NoAuth: Remove bearer token
  const bearerToken = `Bearer ${getLocalStorageObjProperty(
    AUTHENTICATED_USER_KEY,
    "accessToken",
  )}`;
  try {
    // NoAuth: Use option 2 for data variable
    const { data } = await baseAPIClient.get("/entities", {
      // Following line is necessary to set the Content-Type header
      // Reference: https://github.com/axios/axios/issues/86
      data: null,
      headers: { Authorization: bearerToken, "Content-Type": "text/csv" },
    });
    // const { data } = await baseAPIClient.get("/entities", {
    //   // Following line is necessary to set the Content-Type header
    //   // Reference: https://github.com/axios/axios/issues/86
    //   data: null,
    //   headers: { "Content-Type": "text/csv" },
    // });
    return data;
  } catch (error) {
    return error;
  }
};

const update = async (
  id: number | string,
  {
    entityData,
  }: {
    entityData: EntityRequest | FormData;
  },
): Promise<EntityResponse> => {
  // NoAuth: Remove bearer token
  const bearerToken = `Bearer ${getLocalStorageObjProperty(
    AUTHENTICATED_USER_KEY,
    "accessToken",
  )}`;
  try {
    // NoAuth: Use option 2 for data variable
    const { data } = await baseAPIClient.put(`/entities/${id}`, entityData, {
      headers: { Authorization: bearerToken },
    });
    // const { data } = await baseAPIClient.put(`/entities/${id}`, entityData);
    return data;
  } catch (error) {
    return error;
  }
};

export default { create, get, getFile, getCSV, update };
