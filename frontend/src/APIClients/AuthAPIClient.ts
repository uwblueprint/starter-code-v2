import {
  FetchResult,
  MutationFunctionOptions,
  OperationVariables,
} from "@apollo/client";
import AUTHENTICATED_USER_KEY from "../constants/AuthConstants";
import { AuthenticatedUser } from "../types/AuthTypes";
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
type LoginFunction = (
  options?:
    | MutationFunctionOptions<{ login: AuthenticatedUser }, OperationVariables>
    | undefined,
) => Promise<
  FetchResult<
    { login: AuthenticatedUser },
    Record<string, unknown>,
    Record<string, unknown>
  >
>;

const login = async (
  email: string,
  password: string,
  loginFunction: LoginFunction,
): Promise<AuthenticatedUser | null> => {
  let user: AuthenticatedUser = null;
  try {
    const result = await loginFunction({ variables: { email, password } });
    user = result.data?.login ?? null;
    if (user) {
      localStorage.setItem(AUTHENTICATED_USER_KEY, JSON.stringify(user));
    }
  } catch (e: unknown) {
    // eslint-disable-next-line no-alert
    window.alert("Failed to login");
  }
  return user;
};

type LogoutFunction = (
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
    Record<string, unknown>,
    Record<string, unknown>
  >
>;

const logout = async (
  authenticatedUserId: string,
  logoutFunction: LogoutFunction,
): Promise<boolean> => {
  const result = await logoutFunction({
    variables: { userId: authenticatedUserId },
  });
  let success = false;
  if (result.data?.logout === null) {
    success = true;
    localStorage.removeItem(AUTHENTICATED_USER_KEY);
  }
  return success;
};

type RefreshFunction = (
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
    Record<string, unknown>,
    Record<string, unknown>
  >
>;

const refresh = async (refreshFunction: RefreshFunction): Promise<boolean> => {
  const result = await refreshFunction();
  let success = false;
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

// const loginWithGoogle = async (idToken: string): Promise<AuthenticatedUser> => {
//   try {
//     const { data } = await baseAPIClient.post(
//       "/auth/login",
//       { idToken },
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

// export default { login, logout, loginWithGoogle, resetPassword, refresh };
// } rest
