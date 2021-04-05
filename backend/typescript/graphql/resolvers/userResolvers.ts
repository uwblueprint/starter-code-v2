import UserService from "../../services/implementations/userService";
import IUserService from "../../services/interfaces/userService";
import { CreateUserDTO, UpdateUserDTO } from "../../types";

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
