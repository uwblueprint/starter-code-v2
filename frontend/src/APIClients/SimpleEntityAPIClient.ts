import baseAPIClient from "./BaseAPIClient";
import AUTHENTICATED_USER_KEY from "../constants/AuthConstants";
import { getLocalStorageObjProperty } from "../utils/LocalStorageUtils";

enum EnumField {
  "A",
  "B",
  "C",
  "D",
}

export type SimpleEntityRequest = {
  stringField: string;
  intField: number;
  stringArrayField: string[];
  enumField: EnumField;
  boolField: boolean;
};

export type SimpleEntityResponse = {
  id: string | number;
  stringField: string;
  intField: number;
  stringArrayField: string[];
  enumField: EnumField;
  boolField: boolean;
};

const create = async ({
  formData,
}: {
  formData: SimpleEntityRequest;
}): Promise<SimpleEntityResponse> => {
  const bearerToken = `Bearer ${getLocalStorageObjProperty(
    AUTHENTICATED_USER_KEY,
    "accessToken",
  )}`;
  try {
    // typescript {
    const { data } = await baseAPIClient.post("/simpleEntities", formData, {
      headers: { Authorization: bearerToken },
    });
    // } typescript
    // python {
    const { data } = await baseAPIClient.post("/simple-entities", formData, {
      headers: { Authorization: bearerToken },
    });
    // } python
    return data;
  } catch (error) {
    return error;
  }
};

const get = async (): Promise<SimpleEntityResponse[]> => {
  const bearerToken = `Bearer ${getLocalStorageObjProperty(
    AUTHENTICATED_USER_KEY,
    "accessToken",
  )}`;
  try {
    // typescript {
    const { data } = await baseAPIClient.get("/simpleEntities", {
      headers: { Authorization: bearerToken },
    });
    // } typescript
    // python {
    const { data } = await baseAPIClient.get("/simple-entities", {
      headers: { Authorization: bearerToken },
    });
    // } python
    return data;
  } catch (error) {
    return error;
  }
};

const getCSV = async (): Promise<string> => {
  const bearerToken = `Bearer ${getLocalStorageObjProperty(
    AUTHENTICATED_USER_KEY,
    "accessToken",
  )}`;
  try {
    // typescript {
    const { data } = await baseAPIClient.get("/simpleEntities", {
      // Following line is necessary to set the Content-Type header
      // Reference: https://github.com/axios/axios/issues/86
      data: null,
      headers: { Authorization: bearerToken, "Content-Type": "text/csv" },
    });
    // } typescript
    // python {
    const { data } = await baseAPIClient.get("/simple-entities", {
      // Following line is necessary to set the Content-Type header
      // Reference: https://github.com/axios/axios/issues/86
      data: null,
      headers: { Authorization: bearerToken, "Content-Type": "text/csv" },
    });
    // } python
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
    entityData: SimpleEntityRequest;
  },
): Promise<SimpleEntityResponse> => {
  const bearerToken = `Bearer ${getLocalStorageObjProperty(
    AUTHENTICATED_USER_KEY,
    "accessToken",
  )}`;
  try {
    // typescript {
    const { data } = await baseAPIClient.put(
      `/simpleEntities/${id}`,
      entityData,
      {
        headers: { Authorization: bearerToken },
      },
    );
    // } typescript
    // python {
    const { data } = await baseAPIClient.put(
      `/simple-entities/${id}`,
      entityData,
      {
        headers: { Authorization: bearerToken },
      },
    );
    // } python
    return data;
  } catch (error) {
    return error;
  }
};

export default { create, get, getCSV, update };
