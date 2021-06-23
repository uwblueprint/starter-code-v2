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
};

const create = async ({
  formData,
}: {
  formData: EntityRequest;
}): Promise<EntityResponse> => {
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
    return error;
  }
};

const get = async (): Promise<EntityResponse[]> => {
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
    return error;
  }
};

const update = async (
  id: number | string,
  {
    entityData,
  }: {
    entityData: EntityRequest;
  },
): Promise<EntityResponse> => {
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
    return error;
  }
};

export default { create, get, update };
