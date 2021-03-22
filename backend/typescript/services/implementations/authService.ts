import * as firebaseAdmin from "firebase-admin";

import UserService from "./userService";
import IAuthService from "../interfaces/authService";
import IUserService from "../interfaces/userService";
import { Token, Role } from "../../types";
import FirebaseRestClient from "../../utilities/firebaseRestClient";
import Logger from "../../utilities/logger";

class AuthService implements IAuthService {
  userService: IUserService;

  constructor() {
    this.userService = new UserService();
  }

  /* eslint-disable class-methods-use-this */
  async generateToken(email: string, password: string): Promise<Token> {
    try {
      return await FirebaseRestClient.signInWithPassword(email, password);
    } catch (error) {
      Logger.error(`Failed to generate token for user with email ${email}`);
      throw error;
    }
  }

  async revokeTokens(userId: string): Promise<void> {
    try {
      const authId = await this.userService.getAuthIdById(userId);

      await firebaseAdmin.auth().revokeRefreshTokens(authId);
    } catch (error) {
      const errorMessage = [
        "Failed to revoke refresh tokens of user with id",
        `${userId}.`,
        "Reason =",
        error.message,
      ];
      Logger.error(errorMessage.join(" "));

      throw error;
    }
  }

  async renewToken(refreshToken: string): Promise<Token> {
    try {
      return await FirebaseRestClient.refreshToken(refreshToken);
    } catch (error) {
      Logger.error("Failed to refresh token");
      throw error;
    }
  }

  async generatePasswordResetLink(email: string): Promise<string> {
    try {
      return await firebaseAdmin.auth().generatePasswordResetLink(email);
    } catch (error) {
      Logger.error(
        `Failed to generate password reset link for user with email ${email}`,
      );
      throw error;
    }
  }

  async isAuthorized(accessToken: string, role: Role): Promise<boolean> {
    try {
      const decodedIdToken: firebaseAdmin.auth.DecodedIdToken = await firebaseAdmin
        .auth()
        .verifyIdToken(accessToken, true);
      const userRole = await this.userService.getUserRoleByAuthId(
        decodedIdToken.uid,
      );

      return userRole === role;
    } catch (error) {
      return false;
    }
  }
}

export default AuthService;
