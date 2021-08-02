import UserService from "../../services/implementations/userService";
import IUserService from "../../services/interfaces/userService";
import { CreateUserDTO, UpdateUserDTO } from "../../types";
import { generateCSV } from "../../utilities/CSVUtils";

const userService: IUserService = new UserService();

const userResolvers = {
  Query: {
    userById: async (_parent: any, { id }: { id: string }) => {
      return userService.getUserById(id);
    },
    userByIdCSV: async (_parent: any, { id }: { id: string }) => {
      const user = await userService.getUserById(id);
      const csv = await generateCSV([user]);
      return csv;
    },
    userByEmail: async (_parent: any, { email }: { email: string }) => {
      return userService.getUserByEmail(email);
    },
    userByEmailCSV: async (_parent: any, { email }: { email: string }) => {
      const user = await userService.getUserByEmail(email);
      const csv = await generateCSV([user]);
      return csv;
    },
    users: async () => {
      return userService.getUsers();
    },
    usersCSV: async () => {
      const users = await userService.getUsers();
      const csv = await generateCSV(users);
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
