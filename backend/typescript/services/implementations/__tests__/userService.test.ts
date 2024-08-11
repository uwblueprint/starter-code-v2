// postgresql {
import { snakeCase } from "lodash";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
// } postgresql

import UserModel from "../../../models/user.model";
import UserService from "../userService";

import { UserDTO } from "../../../types";

// mongodb {
import db from "../../../testUtils/testDb";
// } mongodb

const testUsers = [
  {
    firstName: "Peter",
    lastName: "Pan",
    authId: "123",
    role: "Admin",
  },
  {
    firstName: "Wendy",
    lastName: "Darling",
    authId: "321",
    role: "User",
  },
];

jest.mock("firebase-admin", () => {
  const auth = jest.fn().mockReturnValue({
    getUser: jest.fn().mockReturnValue({ email: "test@test.com" }),
  });
  return { auth };
});

// mongodb {
describe("mongo userService", (): void => {
  let userService: UserService;

  beforeAll(async () => {
    await db.connect();
  });

  afterAll(async () => {
    await db.disconnect();
  });

  beforeEach(async () => {
    userService = new UserService();
  });

  afterEach(async () => {
    await db.clear();
  });

  it("getUsers", async () => {
    await UserModel.insertMany(testUsers);

    const res = await userService.getUsers();

    res.forEach((user: UserDTO, i) => {
      expect(user.firstName).toEqual(testUsers[i].firstName);
      expect(user.lastName).toEqual(testUsers[i].lastName);
      expect(user.role).toEqual(testUsers[i].role);
    });
  });
});
// } mongodb

// postgresql {  
describe("pg userService", () => {
  let userService: UserService;

  beforeEach(async () => {
    await prisma.$connect();
    await prisma.user.deleteMany(); // Clear the User table before each test
    userService = new UserService();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it("getUsers", async () => {
    const users = testUsers.map((user) => {
      const userSnakeCase: Record<string, string> = {};
      Object.entries(user).forEach(([key, value]) => {
        userSnakeCase[snakeCase(key)] = value;
      });
      return userSnakeCase;
    });

    await prisma.user.createMany({ data: users });

    const res = await userService.getUsers();

    res.forEach((user: UserDTO, i) => {
      expect(user.firstName).toEqual(testUsers[i].firstName);
      expect(user.lastName).toEqual(testUsers[i].lastName);
      expect(user.role).toEqual(testUsers[i].role);
    });
  });
});
// } postgresql
