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

type LoginWithGoogleFunction = (
  options?:
    | MutationFunctionOptions<
        { loginWithGoogle: AuthenticatedUser },
        OperationVariables
      >
    | undefined,
) => Promise<
  FetchResult<
    { loginWithGoogle: AuthenticatedUser },
    Record<string, unknown>,
    Record<string, unknown>
  >
>;

const loginWithGoogle = async (
  idToken: string,
  loginFunction: LoginWithGoogleFunction,
): Promise<AuthenticatedUser | null> => {
  let user: AuthenticatedUser = null;
  try {
    const result = await loginFunction({
      variables: { idToken },
    });
    user = result.data?.loginWithGoogle ?? null;
    if (user) {
      localStorage.setItem(AUTHENTICATED_USER_KEY, JSON.stringify(user));
    }
  } catch (e: unknown) {
    // eslint-disable-next-line no-alert
    window.alert("Failed to login");
  }
  return user;
};

type RegisterFunction = (
  options?:
    | MutationFunctionOptions<
        { register: AuthenticatedUser },
        OperationVariables
      >
    | undefined,
) => Promise<
  FetchResult<
    { register: AuthenticatedUser },
    Record<string, unknown>,
    Record<string, unknown>
  >
>;

const register = async (
  firstName: string,
  lastName: string,
  email: string,
  password: string,
  registerFunction: RegisterFunction,
): Promise<AuthenticatedUser | null> => {
  let user: AuthenticatedUser = null;
  try {
    const result = await registerFunction({
      variables: { firstName, lastName, email, password },
    });
    user = result.data?.register ?? null;
    if (user) {
      localStorage.setItem(AUTHENTICATED_USER_KEY, JSON.stringify(user));
    }
  } catch (e: unknown) {
    // eslint-disable-next-line no-alert
    window.alert("Failed to sign up");
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
  let success = false;
  try {
    const result = await logoutFunction({
      variables: { userId: authenticatedUserId },
    });
    if (result.data?.logout === null) {
      success = true;
      localStorage.removeItem(AUTHENTICATED_USER_KEY);
    }
  } catch (e: unknown) {
    // eslint-disable-next-line no-alert
    window.alert("Failed to logout");
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
  let success = false;
  try {
    const result = await refreshFunction();
    const token = result.data?.refresh;
    if (token) {
      success = true;
      setLocalStorageObjProperty(AUTHENTICATED_USER_KEY, "accessToken", token);
    }
  } catch (e: unknown) {
    // eslint-disable-next-line no-alert
    window.alert("Failed to refresh credentials");
  }
  return success;
};

export default { login, logout, loginWithGoogle, register, refresh };

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

// const register = async (
//   firstName: string,
//   lastName: string,
//   email: string,
//   password: string,
// ): Promise<AuthenticatedUser> => {
//   try {
//     const { data } = await baseAPIClient.post(
//       "/auth/register",
//       { firstName, lastName, email, password },
//       { withCredentials: true },
//     );
//     localStorage.setItem(AUTHENTICATED_USER_KEY, JSON.stringify(data));
//     return data;
//   } catch (error) {
//     return null;
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

// export default { login, logout, loginWithGoogle, register, resetPassword, refresh };
// } rest
