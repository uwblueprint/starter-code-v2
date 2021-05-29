import {
  FetchResult,
  MutationFunctionOptions,
  OperationVariables,
} from "@apollo/client";
import AUTHENTICATED_USER_KEY from "../constants/AuthConstants";
import { AuthenticatedUser } from "../contexts/AuthContext";
// rest {
// import baseAPIClient from "./BaseAPIClient";
// import {
//   getLocalStorageObjProperty,
//   setLocalStorageObjProperty,
// } from "../utils/LocalStorageUtils";
// } rest
// graphql {
import { setLocalStorageObjProperty } from "../utils/LocalStorageUtils";
// } graphql

// graphql {
const login = async (
  email: string,
  password: string,
  loginFunction: (
    options?:
      | MutationFunctionOptions<
          { login: AuthenticatedUser },
          OperationVariables
        >
      | undefined,
  ) => Promise<
    FetchResult<
      { login: AuthenticatedUser },
      Record<string, any>,
      Record<string, any>
    >
  >,
) => {
  const result = await loginFunction({ variables: { email, password } });
  let user: AuthenticatedUser = null;
  if (result) {
    user = result.data?.login ?? null;
    if (user) {
      localStorage.setItem(AUTHENTICATED_USER_KEY, JSON.stringify(user));
    }
  }
  return user;
};

const logout = async (
  authenticatedUserId: string,
  logoutFunction: (
    options?:
      | MutationFunctionOptions<
          {
            logout: null;
          },
          OperationVariables
        >
      | undefined,
  ) => Promise<
    FetchResult<
      {
        logout: null;
      },
      Record<string, any>,
      Record<string, any>
    >
  >,
) => {
  const result = await logoutFunction({
    variables: { userId: authenticatedUserId },
  });
  let success: boolean = false;
  if (result.data?.logout === null) {
    success = true;
    localStorage.removeItem(AUTHENTICATED_USER_KEY);
  }
  return success;
};

const refresh = async (
  refreshFunction: (
    options?:
      | MutationFunctionOptions<
          {
            refresh: string;
          },
          OperationVariables
        >
      | undefined,
  ) => Promise<
    FetchResult<
      {
        refresh: string;
      },
      Record<string, any>,
      Record<string, any>
    >
  >,
) => {
  const result = await refreshFunction();
  let success: boolean = false;
  const token = result.data?.refresh;
  if (token) {
    success = true;
    setLocalStorageObjProperty(AUTHENTICATED_USER_KEY, "accessToken", token);
  }
  return success;
};

export default { login, logout, refresh };

// } graphql

// rest {
// const login = async (
//   email: string,
//   password: string,
// ): Promise<AuthenticatedUser> => {
//   try {
//     const { data } = await baseAPIClient.post(
//       "/auth/login",
//       { email, password },
//       { withCredentials: true },
//     );
//     localStorage.setItem(AUTHENTICATED_USER_KEY, JSON.stringify(data));
//     return data;
//   } catch (error) {
//     return null;
//   }
// };

// const logout = async (userId: string | undefined): Promise<boolean> => {
//   const bearerToken = `Bearer ${getLocalStorageObjProperty(
//     AUTHENTICATED_USER_KEY,
//     "accessToken",
//   )}`;
//   try {
//     await baseAPIClient.post(
//       `/auth/logout/${userId}`,
//       {},
//       { headers: { Authorization: bearerToken } },
//     );
//     localStorage.removeItem(AUTHENTICATED_USER_KEY);
//     return true;
//   } catch (error) {
//     return false;
//   }
// };

// const resetPassword = async (email: string | undefined): Promise<boolean> => {
//   const bearerToken = `Bearer ${getLocalStorageObjProperty(
//     AUTHENTICATED_USER_KEY,
//     "accessToken",
//   )}`;
//   try {
//     await baseAPIClient.post(
//       `/auth/resetPassword/${email}`,
//       {},
//       { headers: { Authorization: bearerToken } },
//     );
//     return true;
//   } catch (error) {
//     return false;
//   }
// };

// for testing only, refresh does not need to be exposed in the client
// const refresh = async (): Promise<boolean> => {
//   try {
//     const { data } = await baseAPIClient.post(
//       "/auth/refresh",
//       {},
//       { withCredentials: true },
//     );
//     setLocalStorageObjProperty(
//       AUTHENTICATED_USER_KEY,
//       "accessToken",
//       data.accessToken,
//     );
//     return true;
//   } catch (error) {
//     return false;
//   }
// };

// export default { login, logout, resetPassword, refresh };
// } rest
