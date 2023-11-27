// typescript {
import axios, { AxiosRequestConfig } from "axios";
// } typescript
// python {
import axios, { AxiosResponse, AxiosRequestConfig } from "axios";
import { camelizeKeys, decamelizeKeys } from "humps";
// } python
// auth {
import jwt from "jsonwebtoken";

import AUTHENTICATED_USER_KEY from "../constants/AuthConstants";
import { DecodedJWT } from "../types/AuthTypes";
import { setLocalStorageObjProperty } from "../utils/LocalStorageUtils";
// } auth

import { DecodedJWT } from "../types/AuthTypes";

const baseAPIClient = axios.create({
  baseURL: process.env.REACT_APP_BACKEND_URL,
});

// python {
// Python API uses snake_case, frontend uses camelCase
// convert request and response data to/from snake_case and camelCase through axios interceptors
baseAPIClient.interceptors.response.use((response: AxiosResponse) => {
  if (
    response.data &&
    response.headers["content-type"] === "application/json"
  ) {
    response.data = camelizeKeys(response.data);
  }
  return response;
});

// } python
baseAPIClient.interceptors.request.use(async (config: AxiosRequestConfig) => {
  const newConfig = { ...config };

  // auth {
  // if access token in header has expired, do a refresh
  const authHeaderParts = config.headers.Authorization?.split(" ");
  if (
    authHeaderParts &&
    authHeaderParts.length >= 2 &&
    authHeaderParts[0].toLowerCase() === "bearer"
  ) {
    const decodedToken = jwt.decode(authHeaderParts[1]) as DecodedJWT;

    if (
      decodedToken &&
      (typeof decodedToken === "string" ||
        decodedToken.exp <= Math.round(new Date().getTime() / 1000))
    ) {
      const { data } = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/auth/refresh`,
        {},
        { withCredentials: true },
      );

      const accessToken = data.accessToken || data.access_token;
      setLocalStorageObjProperty(
        AUTHENTICATED_USER_KEY,
        "accessToken",
        accessToken,
      );

      newConfig.headers.Authorization = `Bearer ${accessToken}`;
    }
  }

  // } auth
  // python {
  if (config.params) {
    newConfig.params = decamelizeKeys(config.params);
  }
  if (config.data && !(config.data instanceof FormData)) {
    newConfig.data = decamelizeKeys(config.data);
  }

  // } python
  return newConfig;
});

export default baseAPIClient;
