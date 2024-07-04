import * as firebaseAdmin from "firebase-admin";
import IUserService from "../interfaces/userService";
import { PrismaClient } from '@prisma/client';
import { CreateUserDTO, Role, UpdateUserDTO, UserDTO } from "../../types";
import { getErrorMessage } from "../../utilities/errorUtils";
import logger from "../../utilities/logger";

const Logger = logger(__filename);
const prisma = new PrismaClient();

class UserService implements IUserService {
  async getUserById(userId: string): Promise<UserDTO> {
    let user;
    let firebaseUser: firebaseAdmin.auth.UserRecord;

    try {
      user = await prisma.user.findUnique({
        where: { id: userId }
      });

      if (!user) {
        throw new Error(`userId ${userId} not found.`);
      }

      firebaseUser = await firebaseAdmin.auth().getUser(user.authId);
    } catch (error: unknown) {
      Logger.error(`Failed to get user. Reason = ${getErrorMessage(error)}`);
      throw error;
    }

    return {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: firebaseUser.email ?? "",
      role: user.role,
    };
  }

  async getUserByEmail(email: string): Promise<UserDTO> {
    let user;
    let firebaseUser: firebaseAdmin.auth.UserRecord;

    try {
      firebaseUser = await firebaseAdmin.auth().getUserByEmail(email);
      user = await prisma.user.findUnique({
        where: { authId: firebaseUser.uid }
      });

      if (!user) {
        throw new Error(`User with authId ${firebaseUser.uid} not found.`);
      }
    } catch (error: unknown) {
      Logger.error(`Failed to get user. Reason = ${getErrorMessage(error)}`);
      throw error;
    }

    return {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: firebaseUser.email ?? "",
      role: user.role,
    };
  }

  async getUserRoleByAuthId(authId: string): Promise<Role> {
    try {
      const user = await prisma.user.findUnique({
        where: { authId }
      });

      if (!user) {
        throw new Error(`User with authId ${authId} not found.`);
      }
      return user.role;
    } catch (error: unknown) {
      Logger.error(`Failed to get user role. Reason = ${getErrorMessage(error)}`);
      throw error;
    }
  }

  async getUserIdByAuthId(authId: string): Promise<string> {
    try {
      const user = await prisma.user.findUnique({
        where: { authId }
      });

      if (!user) {
        throw new Error(`User with authId ${authId} not found.`);
      }
      return user.id;
    } catch (error: unknown) {
      Logger.error(`Failed to get user id. Reason = ${getErrorMessage(error)}`);
      throw error;
    }
  }

  async getAuthIdById(userId: string): Promise<string> {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId }
      });

      if (!user) {
        throw new Error(`User ID ${userId} not found.`);
      }
      return user.authId;
    } catch (error: unknown) {
      Logger.error(`Failed to get authId. Reason = ${getErrorMessage(error)}`);
      throw error;
    }
  }

  async getUsers(): Promise<Array<UserDTO>> {
    let userDtos: Array<UserDTO> = [];

    try {
      const users = await prisma.user.findMany();

      userDtos = await Promise.all(users.map(async (user) => {
        let firebaseUser: firebaseAdmin.auth.UserRecord;

        try {
          firebaseUser = await firebaseAdmin.auth().getUser(user.authId);
        } catch (error) {
          Logger.error(`User with authId ${user.authId} could not be fetched from Firebase`);
          throw error;
        }

        return {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: firebaseUser.email ?? "",
          role: user.role,
        };
      }));
    } catch (error: unknown) {
      Logger.error(`Failed to get users. Reason = ${getErrorMessage(error)}`);
      throw error;
    }

    return userDtos;
  }

  async createUser(user: CreateUserDTO, authId?: string, signUpMethod = "PASSWORD"): Promise<UserDTO> {
    let firebaseUser: firebaseAdmin.auth.UserRecord;

    try {
      if (signUpMethod === "GOOGLE") {
        firebaseUser = await firebaseAdmin.auth().getUser(authId!);
      } else {
        firebaseUser = await firebaseAdmin.auth().createUser({
          email: user.email,
          password: user.password,
        });
      }

      const newUser = await prisma.user.create({
        data: {
          firstName: user.firstName,
          lastName: user.lastName,
          authId: firebaseUser.uid,
          role: user.role,
        }
      });

      return {
        id: newUser.id,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        email: firebaseUser.email ?? "",
        role: newUser.role,
      };
    } catch (error: unknown) {
      Logger.error(`Failed to create user. Reason = ${getErrorMessage(error)}`);
      throw error;
    }
  }

  async updateUserById(userId: string, user: UpdateUserDTO): Promise<UserDTO> {
    try {
      const updateResult = await prisma.user.update({
        where: { id: userId },
        data: {
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
        }
      });

      let firebaseUser = await firebaseAdmin.auth().updateUser(updateResult.authId, {
        email: user.email
      });

      return {
        id: updateResult.id,
        firstName: updateResult.firstName,
        lastName: updateResult.lastName,
        email: firebaseUser.email ?? "",
        role: updateResult.role,
      };
    } catch (error: unknown) {
      Logger.error(`Failed to update user. Reason = ${getErrorMessage(error)}`);
      throw error;
    }
  }

  async deleteUserById(userId: string): Promise<void> {
    try {
      const user = await prisma.user.delete({
        where: { id: userId }
      });

      try {
        await firebaseAdmin.auth().deleteUser(user.authId);
      } catch (error) {
        Logger.error(`Failed to delete Firebase user after deleting user in database. AuthId: ${user.authId}`);
        throw error;
      }
    } catch (error: unknown) {
      Logger.error(`Failed to delete user. Reason = ${getErrorMessage(error)}`);
      throw error;
    }
  }

  async deleteUserByEmail(email: string): Promise<void> {
    try {
      const firebaseUser = await firebaseAdmin.auth().getUserByEmail(email);
      const user = await prisma.user.delete({
        where: { authId: firebaseUser.uid }
      });

      try {
        await firebaseAdmin.auth().deleteUser(user.authId);
      } catch (error) {
        Logger.error(`Failed to delete Firebase user after deleting user in database. AuthId: ${user.authId}`);
        throw error;
      }
    } catch (error: unknown) {
      Logger.error(`Failed to delete user by email. Reason = ${getErrorMessage(error)}`);
      throw error;
    }
  }
}

export default UserService;
