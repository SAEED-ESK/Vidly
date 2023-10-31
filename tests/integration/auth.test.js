const request = require("supertest");
const { User } = require("../../models/user");
const { Genres } = require("../../models/genre");

let server;
let token;

describe("auth middleware", () => {
  beforeEach(() => {
    server = require("../../app");
  });
  afterEach(async () => {
    await server.close();
    await Genres.deleteOne();
  });

  const exec = function () {
    return request(server)
      .post("/api/genres")
      .set("x-auth-token", token)
      .send({ name: "genres" });
  };

  beforeEach(() => {
    token = new User().generateAuthToken();
  });

  it("should return 401 if token is empty", async () => {
    token = "";

    const res = await exec();

    expect(res.status).toBe(401);
  });

  it("should return 400 if token is invalid", async () => {
    token = "a";

    const res = await exec();

    expect(res.status).toBe(400);
  });

  it("should return 200 if token is valid", async () => {
    const res = await exec();

    expect(res.status).toBe(200);
  });
});
