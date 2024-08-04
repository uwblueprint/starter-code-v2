import {
  CreateUserDTO,
  Role,
  SignUpMethod,
  UpdateUserDTO,
  UserDTO,
} from "../../types";

interface IUserService {
  /**
   * Retrieves a user by their ID.
   * @param userId The ID of the user to retrieve.
   * @returns A UserDTO containing the user's information or null if no user is found.
   * @throws Error if the retrieval process fails.
   */
  getUserById(userId: string): Promise<UserDTO>;

  /**
   * Retrieves a user by their email address.
   * @param email The email address of the user to retrieve.
   * @returns A UserDTO containing the user's information or null if no user is found.
   * @throws Error if the retrieval process fails.
   */
  getUserByEmail(email: string): Promise<UserDTO>;

  /**
   * Retrieves the role of a user by their authentication ID.
   * @param authId The authentication ID associated with the user.
   * @returns The role of the user or null if the user cannot be found.
   * @throws Error if the retrieval process fails.
   */
  getUserRoleByAuthId(authId: string): Promise<Role>;

  /**
   * Retrieves the ID of a user by their authentication ID.
   * @param authId The authentication ID associated with the user.
   * @returns The user's ID or null if the user cannot be found.
   * @throws Error if the retrieval process fails.
   */
  getUserIdByAuthId(authId: string): Promise<string>;

  /**
   * Retrieves the authentication ID associated with a user ID.
   * @param userId The user's ID to lookup the authentication ID.
   * @returns The authentication ID or null if the user cannot be found.
   * @throws Error if the retrieval process fails.
   */
  getAuthIdById(userId: string): Promise<string>;

  /**
   * Retrieves all users in the system.
   * @returns An array of UserDTOs, which could be empty if no users are found.
   * @throws Error if the retrieval process fails.
   */
  getUsers(): Promise<Array<UserDTO>>;

  /**
   * Creates a user with the specified details.
   * @param user The details of the user to create.
   * @param authId Optional; the user's Firebase authentication ID.
   * @param signUpMethod Optional; the method the user used to sign up.
   * @returns A UserDTO containing the created user's information.
   * @throws Error if the user creation process fails.
   */
  createUser(
    user: CreateUserDTO,
    authId?: string,
    signUpMethod?: SignUpMethod,
  ): Promise<UserDTO>;

  /**
   * Updates the information of a user by their ID.
   * @param userId The ID of the user to update.
   * @param user The new details to update the user with.
   * @returns A UserDTO containing the updated user's information.
   * @throws Error if the update process fails.
   */
  updateUserById(userId: string, user: UpdateUserDTO): Promise<UserDTO>;

  /**
   * Deletes a user by their user ID.
   * @param userId The ID of the user to delete.
   * @throws Error if the deletion process fails.
   */
  deleteUserById(userId: string): Promise<void>;

  /**
   * Deletes a user by their email address.
   * @param email The email of the user to delete.
   * @throws Error if the deletion process fails.
   */
  deleteUserByEmail(email: string): Promise<void>;
}

export default IUserService;
