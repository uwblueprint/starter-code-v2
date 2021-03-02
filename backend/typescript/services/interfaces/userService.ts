import { CreateUserDTO, UpdateUserDTO, UserDTO } from "../../types";

interface IUserService {
  /**
   * Get user associated with id
   * @param id user's id
   * @returns a UserDTO with user's information
   */
  getUserById(id: number): UserDTO;

  /**
   * Get user associated with email
   * @param email user's email
   * @returns a UserDTO with user's information
   */
  getUserByEmail(email: string): UserDTO;

  /**
   * Get all user information (possibly paginated in the future)
   * @returns array of UserDTOs
   */
  getUsers(): Array<UserDTO>;

  /**
   * Create a user, email verification configurable
   * @param user the user to be created
   * @returns a UserDTO with the created user's information
   */
  createUser(user: CreateUserDTO): UserDTO;

  /**
   * Update a user.
   * Note: the password cannot be updated using this method, use IAuthService.resetPassword instead
   * @param userId user's id
   * @param user the user to be updated
   * @returns a UserDTO with the updated user's information
   */
  updateUserById(userId: number, user: UpdateUserDTO): UserDTO;

  /**
   * Delete a user by id
   * @param userId user's userId
   */
  deleteUserById(userId: number): void;

  /**
   * Delete a user by email
   * @param email user's email
   */
  deleteUserByEmail(email: string): void;
}
