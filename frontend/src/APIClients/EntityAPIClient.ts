import baseAPIClient from "./BaseAPIClient";
// auth {
import AUTHENTICATED_USER_KEY from "../constants/AuthConstants";
import { getLocalStorageObjProperty } from "../utils/LocalStorageUtils";
// } auth

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
  // file-storage {
  fileName: string;
  // } file-storage
};

const create = async ({
  formData,
}: {
  // no-file-storage {
  formData: EntityRequest;
  // } no-file-storage
  // file-storage {
  formData: FormData;
  // } file-storage
}): Promise<EntityResponse | null> => {
  // auth {
  const bearerToken = `Bearer ${getLocalStorageObjProperty(
    AUTHENTICATED_USER_KEY,
    "accessToken",
  )}`;
  // } auth
  try {
    // auth {
    const { data } = await baseAPIClient.post("/entities", formData, {
      headers: { Authorization: bearerToken },
    });
    // } auth
    // no-auth {
    const { data } = await baseAPIClient.post("/entities", formData);
    // } no-auth
    return data;
  } catch (error) {
    return null;
  }
};

const get = async (): Promise<EntityResponse[] | null> => {
  // auth {
  const bearerToken = `Bearer ${getLocalStorageObjProperty(
    AUTHENTICATED_USER_KEY,
    "accessToken",
  )}`;
  // } auth
  try {
    // auth {
    const { data } = await baseAPIClient.get("/entities", {
      headers: { Authorization: bearerToken },
    });
    // } auth
    // no-auth {
    const { data } = await baseAPIClient.get("/entities");
    // } no-auth
    return data;
  } catch (error) {
    return null;
  }
};

// file-storage {
const getFile = async (uuid: string): Promise<string | null> => {
  // auth {
  const bearerToken = `Bearer ${getLocalStorageObjProperty(
    AUTHENTICATED_USER_KEY,
    "accessToken",
  )}`;
  // } auth
  try {
    // auth {
    const { data } = await baseAPIClient.get(`/entities/files/${uuid}`, {
      headers: { Authorization: bearerToken },
    });
    // } auth

    // no-auth {
    const { data } = await baseAPIClient.get(`/entities/files/${uuid}`);
    // } no-auth
    // typescript {
    return data.fileURL
    // } typescript
    // python {
    return data.fileUrl;
    // } python
  } catch (error) {
    return null;
  }
};

// } file-storage
const getCSV = async (): Promise<string | null> => {
  // auth {
  const bearerToken = `Bearer ${getLocalStorageObjProperty(
    AUTHENTICATED_USER_KEY,
    "accessToken",
  )}`;
  // } auth
  try {
    // auth {
    const { data } = await baseAPIClient.get("/entities", {
      // Following line is necessary to set the Content-Type header
      // Reference: https://github.com/axios/axios/issues/86
      data: null,
      headers: { Authorization: bearerToken, "Content-Type": "text/csv" },
    });
    // } auth

    // no-auth {
    const { data } = await baseAPIClient.get("/entities", {
      // Following line is necessary to set the Content-Type header
      // Reference: https://github.com/axios/axios/issues/86
      data: null,
      headers: { "Content-Type": "text/csv" },
    });
    // } no-auth
    return data;
  } catch (error) {
    return null;
  }
};

const update = async (
  id: number | string,
  {
    entityData,
  }: {
    // no-file-storage {
    entityData: EntityRequest;
    // } no-file-storage
    // file-storage {
    entityData: FormData;
    // } file-storage
  },
): Promise<EntityResponse | null> => {
  // auth {
  const bearerToken = `Bearer ${getLocalStorageObjProperty(
    AUTHENTICATED_USER_KEY,
    "accessToken",
  )}`;
  // } auth
  try {
    // auth {
    const { data } = await baseAPIClient.put(`/entities/${id}`, entityData, {
      headers: { Authorization: bearerToken },
    });
    // } auth
    // no-auth {
    const { data } = await baseAPIClient.put(`/entities/${id}`, entityData);
    // } no-auth
    return data;
  } catch (error) {
    return null;
  }
};

// no-file-storage {
export default { create, get, getCSV, update };
// } no-file-storage
// file-storage {
export default { create, get, getFile, getCSV, update };
// } file-storage
