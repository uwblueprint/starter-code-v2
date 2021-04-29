import baseAPIClient from "./BaseAPIClient";
import USER_ACCESS_TOKEN_KEY from "../constants/AuthConstants";

const login = async (email: string, password: string): Promise<boolean> => {
  try {
    const { data } = await baseAPIClient.post(
      "/auth/login",
      { email, password },
      { withCredentials: true },
    );
    localStorage.setItem(USER_ACCESS_TOKEN_KEY, data.accessToken);
    return true;
  } catch (error) {
    return false;
  }
};

const logout = async (userId: string): Promise<boolean> => {
  const bearerToken = `Bearer ${localStorage.getItem(USER_ACCESS_TOKEN_KEY)}`;
  try {
    await baseAPIClient.post(
      `/auth/logout/${userId}`,
      {},
      { headers: { Authorization: bearerToken } },
    );
    localStorage.removeItem(USER_ACCESS_TOKEN_KEY);
    return true;
  } catch (error) {
    return false;
  }
};

const resetPassword = async (email: string): Promise<boolean> => {
  const bearerToken = `Bearer ${localStorage.getItem(USER_ACCESS_TOKEN_KEY)}`;
  try {
    await baseAPIClient.post(
      `/auth/resetPassword/${email}`,
      {},
      { headers: { Authorization: bearerToken } },
    );
    return true;
  } catch (error) {
    return false;
  }
};

// for testing only, refresh does not need to be exposed in the client
const refresh = async (): Promise<boolean> => {
  try {
    const { data } = await baseAPIClient.post(
      "/auth/refresh",
      {},
      { withCredentials: true },
    );
    localStorage.setItem(USER_ACCESS_TOKEN_KEY, data.accessToken);
    return true;
  } catch (error) {
    return false;
  }
};

export default { login, logout, resetPassword, refresh };
