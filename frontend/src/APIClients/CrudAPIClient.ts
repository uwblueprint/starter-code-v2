import baseAPIClient from "./BaseAPIClient";
import USER_ACCESS_TOKEN_KEY from "../constants/AuthConstants";

const create = async ({ formData }: { formData: any }): Promise<any> => {
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

const update = async ({ formData }: { formData: any }): Promise<any> => {
  const bearerToken = `Bearer ${localStorage.getItem(USER_ACCESS_TOKEN_KEY)}`;
  try {
    const entityData = JSON.parse(JSON.stringify(formData));
    delete entityData.id;
    // should account for it it's for python or typescript
    const { data } = await baseAPIClient.put(
      `/entities/${formData.id}`,
      entityData,
      { headers: { Authorization: bearerToken } },
    );
    console.log(data);
    return data;
  } catch (error) {
    console.log(error);
    return error;
  }
};

export default { create, update };
