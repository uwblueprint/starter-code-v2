import UserService from "../../services/implementations/userService";
import IUserService from "../../services/interfaces/userService";
import { CreateUserDTO, UpdateUserDTO, UserDTO } from "../../types";
import { generateCSV } from "../../utilities/csvUtils";

const userService: IUserService = new UserService();

const userResolvers = {
  Query: {
    userById: async (_parent: any, { id }: { id: string }) => {
      return userService.getUserById(id);
    },
    userByEmail: async (_parent: any, { email }: { email: string }) => {
      return userService.getUserByEmail(email);
    },
    users: async () => {
      return userService.getUsers();
    },
    usersCSV: async () => {
      const users = await userService.getUsers();
      const csv = await generateCSV<UserDTO>({ data: users });
      return csv;
    },
  },
  Mutation: {
    createUser: async (_parent: any, { user }: { user: CreateUserDTO }) => {
      return userService.createUser(user);
    },
    updateUser: async (
      _parent: any,
      { id, user }: { id: string; user: UpdateUserDTO },
    ) => {
      return userService.updateUserById(id, user);
    },
    deleteUserById: async (_parent: any, { id }: { id: string }) => {
      return userService.deleteUserById(id);
    },
    deleteUserByEmail: async (_parent: any, { email }: { email: string }) => {
      return userService.deleteUserByEmail(email);
    },
  },
};

export default userResolvers;
