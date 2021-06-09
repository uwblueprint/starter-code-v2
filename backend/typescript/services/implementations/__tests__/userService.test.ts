import MgUser from "../../../models/user.mgmodel";
import PgUser from "../../../models/user.pgmodel";
import UserService from "../userService";

import { UserDTO } from "../../../types";

import db, { testSql } from "../../../testUtils/testDb";

jest.mock("firebase-admin", () => {
  const auth = jest.fn().mockReturnValue({
    getUser: jest.fn().mockReturnValue({ email: "test@test.com" }),
  });
  return { auth };
});

describe("mongo userService", (): void => {
  let userService: UserService;

  beforeAll(async () => {
    db.connect();
  });

  afterAll(async () => {
    db.disconnect();
  });

  beforeEach(async () => {
    userService = new UserService();
  });

  afterEach(async () => {
    db.clear();
  });

  it("getUsers", async () => {
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

    await MgUser.insertMany(testUsers);

    const res = await userService.getUsers();

    res.forEach((user: UserDTO, i) => {
      expect(user.firstName).toEqual(testUsers[i].firstName);
      expect(user.lastName).toEqual(testUsers[i].lastName);
      expect(user.role).toEqual(testUsers[i].role);
    });
  });
});

describe("pg userService", () => {
  beforeEach(async () => {
    await testSql.sync({ force: true });
  });

  afterAll(async () => {
    await testSql.sync({ force: true });
    await testSql.close();
  });

  it("getUsers", async () => {
    await PgUser.bulkCreate([
      {
        first_name: "Peter",
        last_name: "Pan",
        auth_id: "123",
        role: "Admin",
      },
    ]);
    const res = await PgUser.findAll();
    console.log(res);
  });
});
