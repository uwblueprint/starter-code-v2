import { Role, Token } from "../../types";

interface IAuthService {
  /**
   * Generate a short-lived JWT access token and a long-lived refresh token
   * when supplied user's email and password
   * @param email user's email
   * @param password user's password
   * @returns Token object containing the access token and refresh token
   * @throws Error if token generation fails
   */
  generateToken(email: string, password: string): Promise<Token>;

  /**
   * Revoke all refresh tokens of a user
   * @param userId userId of user whose refresh tokens are to be revoked
   * @throws Error if token revocation fails
   */
  revokeTokens(userId: string): Promise<void>;

  /**
   * Generate new access and refresh token pair using the provided refresh token
   * @param refreshToken refresh token
   * @returns Token object containing new access and refresh tokens
   * @throws Error if token renewal fails
   */
  renewToken(refreshToken: string): Promise<Token>;

  /**
   * Generate a password reset link
   * @param email email of user requesting password reset
   * @returns password reset link
   * @throws Error if unable to generate link
   */
  generatePasswordResetLink(email: string): Promise<string>;

  // TODO: resetPassword(email: string): Promise<void>;
  // (dependent on EmailService)

  /**
   * Determine if the provided access token is valid and authorized for at least
   * one of the specified roles
   * @param accessToken user's access token
   * @param roles roles to check for
   * @returns true if token valid and authorized, false otherwise
   */
  isAuthorized(accessToken: string, roles: Set<Role>): Promise<boolean>;
}

export default IAuthService;
