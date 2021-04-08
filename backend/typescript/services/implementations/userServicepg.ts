import * as firebaseAdmin from "firebase-admin";
import IUserService from "../interfaces/userService";
import { CreateUserDTO, Role, UpdateUserDTO, UserDTO } from "../../types";
import Logger from "../../utilities/logger";
import User from "../../models/user.pgmodel";

class PGUserService implements IUserService {
  /* eslint-disable class-methods-use-this */

  async getUserById(userId: string): Promise<UserDTO> {
    let user: User | null;
    let firebaseUser: firebaseAdmin.auth.UserRecord;

    try {
      user = await User.findByPk(Number(userId));

      if (!user) {
        throw new Error(`userId ${userId} not found.`);
      }
      firebaseUser = await firebaseAdmin.auth().getUser(user.authId);
    } catch (error) {
      Logger.error(`Failed to get user. Reason = ${error.message}`);
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
    let user: User | null;
    let firebaseUser: firebaseAdmin.auth.UserRecord;

    try {
      firebaseUser = await firebaseAdmin.auth().getUserByEmail(email);
      user = await User.findOne({ 
        where: { authId: firebaseUser.authId },
      });

      if (!user) {
        throw new Error(`userId with authID ${firebaseUser.uid} not found.`);
      }
    } catch (error) {
      Logger.error(`Failed to get user. Reason = ${error.message}`);
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
      const user: User | null = await User.findOne({
        where: { authId: authId },
      });
      if (!user) {
        throw new Error(`userId with authId ${authId} not found.`);
      }
      return user.role;
    } catch (error) {
      Logger.error(`Failed to get user role. Reason = ${error.message}`);
      throw error;
    }
  }

  async getAuthIdById(userId: string): Promise<string> {
    try {
      const user: User | null = await User.findByPk(userId);
      if (!user) {
        throw new Error(`userId ${userId} not found.`);
      }
      return user.authId;
    } catch (error) {
      Logger.error(`Failed to get user role. Reason = ${error.message}`);
      throw error;
    }
  }

  async getUsers(): Promise<Array<UserDTO>> {
    let userDtos: Array<UserDTO> = [];
    try {
      const users: Array<User> = await User.findAll();

      userDtos = await Promise.all(
        users.map(async (user) => {
          let firebaseUser: firebaseAdmin.auth.UserRecord;

          try {
            firebaseUser = await firebaseAdmin.auth().getUser(user.authId);
          } catch (error) {
            Logger.error(
              `user with authId ${user.authId} could not be fetched from Firebase`,
            );
            throw error;
          }

          return {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: firebaseUser.email ?? "",
            role: user.role,
          };
        }),
      );
    } catch (error) {
      Logger.error(`Failed to get users. Reason = ${error.message}`);
      throw error;
    }

    return userDtos;
  }

  async createUser(user: CreateUserDTO): Promise<UserDTO> {
    let newUser: User;
    let firebaseUser: firebaseAdmin.auth.UserRecord;

    try {
      firebaseUser = await firebaseAdmin.auth().createUser({
        email: user.email,
        password: user.password,
      });

      try {
        newUser = await User.create({
          firstName: user.firstName,
          lastName: user.lastName,
          authId: firebaseUser.uid,
          role: user.role,
        });
      } catch (postgresError) {
        try {
          await firebaseAdmin.auth().deleteUser(firebaseUser.uid);
        } catch (firebaseError) {
          const errorMessage = [
            "Failed to rollback Firebase user creation after MongoDB user creation failure. Reason =",
            firebaseError.message,
            "Orphaned authId (Firebase uid) =",
            firebaseUser.uid,
          ];
          Logger.error(errorMessage.join(""));
        }

        throw postgresError;
      }
    } catch (error) {
      Logger.error(`Failed to create user. Reason = ${error.message}`);
      throw error;
    }

    return {
      id: newUser.id,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      email: firebaseUser.email ?? "",
      role: newUser.role,
    };
  }

  async updateUserById(userId: string, user: UpdateUserDTO): Promise<UserDTO> {
    let oldUser: User | null;
    let updatedFirebaseUser: firebaseAdmin.auth.UserRecord;

    try {
      oldUser = await User.findByPk(Number(userId));

      if (!oldUser) {
        throw new Error(`userId ${userId} not found.`)
      }

      User.update({
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role
       },
       {
        where: { id: userId}
       });

      try {
        updatedFirebaseUser = await firebaseAdmin
          .auth()
          .updateUser(oldUser.authId, { email: user.email });
      } catch (error) {
        // rollback Postgres user updates
        try {
          await User.update({
            firstName: oldUser.firstName,
            lastName: oldUser.lastName,
            role: oldUser.role
           },
           {
            where: { id: userId}
           });

        } catch (postgresError) {
          const errorMessage = [
            "Failed to rollback Postgres user update after Firebase user update failure. Reason =",
            postgresError.message,
            "Postgres user id with possibly inconsistent data =",
            oldUser.id,
          ];
          Logger.error(errorMessage.join(" "));
        }
      }
        
    } catch (error) {
      Logger.error(`Failed to update user. Reason = ${error.message}`);
      throw error;
    }
        

    return {
      id: userId,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
    };
  }

  async deleteUserById(userId: string): Promise<void> {
    try {
      const deletedUser: User | null = await User.findByPk(Number(userId));

      if (!deletedUser) {
        throw new Error(`userid ${userId} not found.`);
      }

      const numDestroyed: number = await User.destroy({ where: { id: userId }});

      if (numDestroyed <= 0) {
        throw new Error(`userid ${userId} was not deleted in Postgres.`);
      }

      try {
        await firebaseAdmin.auth().deleteUser(deletedUser.authId);
      } catch (error) {
        // rollback user deletion in Postgres
        try {
          await User.create({
            firstName: deletedUser.firstName,
            lastName: deletedUser.lastName,
            authId: deletedUser.authId,
            role: deletedUser.role,
          });
        } catch (postgresError) {
          const errorMessage = [
            "Failed to rollback Postgres user deletion after Firebase user deletion failure. Reason =",
            postgresError.message,
            "Firebase uid with non-existent Postgres record =",
            deletedUser.authId,
          ];
          Logger.error(errorMessage.join(" "));
        }

        throw error;
      }
    } catch (error) {
      Logger.error(`Failed to delete user. Reason = ${error.message}`);
      throw error;
    }
  }

  async deleteUserByEmail(email: string): Promise<void> {
    try {
      const firebaseUser: firebaseAdmin.auth.UserRecord = await firebaseAdmin
        .auth()
        .getUserByEmail(email);
      const deletedUser: User | null = await User.findByPk(Number(firebaseUser.userId));

      if (!deletedUser) {
        throw new Error(`userid ${firebaseUser.uid} not found.`);
      }

      const numDestroyed: number = await User.destroy({ where: { id: firebaseUser.uid }});

      if (numDestroyed <= 0) {
        throw new Error(`userid ${firebaseUser.uid} was not deleted in Postgres.`);
      }

      try {
        await firebaseAdmin.auth().deleteUser(deletedUser.authId);
      } catch (error) {
        // rollback user deletion in Postgres
        try {
          await User.create({
            firstName: deletedUser.firstName,
            lastName: deletedUser.lastName,
            authId: deletedUser.authId,
            role: deletedUser.role,
          });
        } catch (postgresError) {
          const errorMessage = [
            "Failed to rollback Postgres user deletion after Firebase user deletion failure. Reason =",
            postgresError.message,
            "Firebase uid with non-existent Postgres record =",
            deletedUser.authId,
          ];
          Logger.error(errorMessage.join(" "));
        }

        throw error;
      }
    } catch(error) {
      Logger.error(`Failed to delete user. Reason = ${error.message}`);
      throw error;
    }
  }
}

export default PGUserService;
