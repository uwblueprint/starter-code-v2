import baseAPIClient from "./BaseAPIClient";
import USER_ACCESS_TOKEN_KEY from "../constants/AuthConstants";

enum EnumField {
  "A",
  "B",
  "C",
  "D",
}

type EntityRequest = {
  stringField: string;
  intField: number;
  stringArrayField: string[];
  enumField: EnumField;
  boolField: boolean;
};

type EntityResponse = {
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
  const bearerToken = `Bearer ${localStorage.getItem(USER_ACCESS_TOKEN_KEY)}`;
  try {
    const { data } = await baseAPIClient.post("/entities", formData, {
      headers: { Authorization: bearerToken },
    });
    return data;
  } catch (error) {
    return error;
  }
};

const get = async (): Promise<EntityResponse[]> => {
  const bearerToken = `Bearer ${localStorage.getItem(USER_ACCESS_TOKEN_KEY)}`;
  try {
    const { data } = await baseAPIClient.get("/entities", {
      headers: { Authorization: bearerToken },
    });
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
  const bearerToken = `Bearer ${localStorage.getItem(USER_ACCESS_TOKEN_KEY)}`;
  try {
    const { data } = await baseAPIClient.put(`/entities/${id}`, entityData, {
      headers: { Authorization: bearerToken },
    });
    return data;
  } catch (error) {
    return error;
  }
};

export default { create, get, update };
