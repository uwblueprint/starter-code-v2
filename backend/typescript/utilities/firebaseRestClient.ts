import fetch, { Response } from "node-fetch";

import { Token } from "../types";
import Logger from "./logger";

const FIREBASE_SIGN_IN_URL =
  "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword";
const FIREBASE_REFRESH_TOKEN_URL =
  "https://securetoken.googleapis.com/v1/token";

type SignInResponse = {
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered: boolean;
};

type RefreshTokenResponse = {
  expires_in: string;
  token_type: string;
  refresh_token: string;
  id_token: string;
  user_id: string;
  project_id: string;
};

type RequestError = {
  error: {
    code: number;
    message: string;
    errors: any;
  };
};

const FirebaseRestClient = {
  // Docs: https://firebase.google.com/docs/reference/rest/auth/#section-sign-in-email-password
  signInWithPassword: async (
    email: string,
    password: string,
  ): Promise<Token> => {
    const response: Response = await fetch(
      `${FIREBASE_SIGN_IN_URL}?key=${process.env.FIREBASE_WEB_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
          returnSecureToken: true,
        }),
      },
    );

    const responseJson: SignInResponse | RequestError = await response.json();

    if (!response.ok) {
      const errorMessage = [
        "Failed to sign-in via Firebase REST API, status code =",
        `${response.status},`,
        "error message =",
        (responseJson as RequestError).error.message,
      ];
      Logger.error(errorMessage.join(" "));

      throw new Error("Failed to sign-in via Firebase REST API");
    }

    return {
      accessToken: (responseJson as SignInResponse).idToken,
      refreshToken: (responseJson as SignInResponse).refreshToken,
    };
  },

  // Docs: https://firebase.google.com/docs/reference/rest/auth/#section-refresh-token
  refreshToken: async (refreshToken: string): Promise<Token> => {
    const response: Response = await fetch(
      `${FIREBASE_REFRESH_TOKEN_URL}?key=${process.env.FIREBASE_WEB_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: `grant_type=refresh_token&refresh_token=${refreshToken}`,
      },
    );

    const responseJson:
      | RefreshTokenResponse
      | RequestError = await response.json();

    if (!response.ok) {
      const errorMessage = [
        "Failed to refresh token via Firebase REST API, status code =",
        `${response.status},`,
        "error message =",
        (responseJson as RequestError).error.message,
      ];
      Logger.error(errorMessage.join(" "));

      throw new Error("Failed to refresh token via Firebase REST API");
    }

    return {
      accessToken: (responseJson as RefreshTokenResponse).id_token,
      refreshToken: (responseJson as RefreshTokenResponse).refresh_token,
    };
  },
};

export default FirebaseRestClient;
