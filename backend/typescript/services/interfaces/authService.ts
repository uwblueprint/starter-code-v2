import { Role, Token } from "../../types";

interface IAuthService {
  /**
   * Generate a short-lived JWT access token and a long-lived refresh token
   * when supplied user's email and password
   * @param email user's email
   * @param password user's password
   * @returns Token object containing the access token and refresh token
   */
  generateToken(email: string, password: string): Token;

  /**
   * Revoke the provided access and refresh tokens in the Token object
   * @param token Token to be revoked
   */
  revokeToken(token: Token): void;

  /**
   * Generate a new access token using the provided refresh token
   * @param refreshToken refresh token
   * @returns new access token
   */
  renewToken(refreshToken: string): string;

  /**
   * Trigger password reset flow for the user with the given email
   * @param email user's email
   */
  resetPassword(email: string): void;

  /**
   * Determine if the provided access token is valid and authorized for the
   * specified role
   * @param accessToken user's access token
   * @param role role to check for
   * @returns true if token valid and authorized, false otherwise
   */
  isAuthorized(accessToken: string, role: Role): boolean;
}
