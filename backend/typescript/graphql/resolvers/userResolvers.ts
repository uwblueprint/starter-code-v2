import nodemailerConfig from "../../nodemailer.config";
import AuthService from "../../services/implementations/authService";
import EmailService from "../../services/implementations/emailService";
import UserService from "../../services/implementations/userService";
import IAuthService from "../../services/interfaces/authService";
import IEmailService from "../../services/interfaces/emailService";
import IUserService from "../../services/interfaces/userService";
import { CreateUserDTO, UpdateUserDTO, UserDTO } from "../../types";
import { generateCSV } from "../../utilities/CSVUtils";

const userService: IUserService = new UserService();
const emailService: IEmailService = new EmailService(nodemailerConfig);
const authService: IAuthService = new AuthService(userService, emailService);

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
      const newUser = await userService.createUser(user);
      await authService.sendEmailVerificationLink(newUser.email);
      return newUser;
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
