const request = require("supertest");
const { Genres } = require("../../models/genre");
const { User } = require("../../models/user");
const { default: mongoose } = require("mongoose");

let server;

describe("/api/genres", () => {
  beforeEach(() => {
    server = require("../../app");
  });
  afterEach(async () => {
    await server.close();
    await Genres.deleteOne();
  });
  describe("GET /", () => {
    it("should return all genres", async () => {
      await Genres.collection.insertMany([
        { name: "genres1" },
        { name: "genres2" },
      ]);

      const response = await request(server).get("/api/genres");

      expect(response.status).toBe(200);
      expect(response.body.length).toBe(2);
      expect(response.body.some((g) => g.name === "genres1")).toBeTruthy();
      expect(response.body.some((g) => g.name === "genres2")).toBeTruthy();
    });
  });
  describe("GET /:id", () => {
    it("should return one genre with specified id", async () => {
      const genre = new Genres({ name: "genres" });
      await genre.save();

      const response = await request(server).get(`/api/genres/${genre._id}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("name", genre.name);
    });
    it("should return 404 if invalid id is passed", async () => {
      const response = await request(server).get("/api/genres/1");

      expect(response.status).toBe(404);
    });

    it("should return 404 if no genre with the given id exists", async () => {
      const id = new mongoose.Types.ObjectId();

      const response = await request(server).get("/api/genres/" + id);

      expect(response.status).toBe(404);
    });
  });
  describe("POST /", () => {
    let token;
    let name;

    const exec = async () => {
      return await request(server)
        .post("/api/genres")
        .set("x-auth-token", token)
        .send({ name });
    };

    beforeEach(() => {
      token = new User().generateAuthToken();
      name = "genres";
    });

    it("should return 401 if client not logged", async () => {
      token = "";
      const res = await exec();

      expect(res.status).toBe(401);
    });
    it("should return 400 if genre is less than 4 characters", async () => {
      name = "1234";
      const res = await exec();

      expect(res.status).toBe(400);
    });
    it("should return 400 if genre is more than 50 characters", async () => {
      name = new Array(52).join("a");
      const res = await exec();

      expect(res.status).toBe(400);
    });
    it("should save the genre if it is valid", async () => {
      await exec();

      const genres = await Genres.find({ name: "genres" });

      expect(genres).not.toBeNull();
    });
    it("should return the genre if it is valid", async () => {
      const res = await exec();

      expect(res.body).toHaveProperty("_id");
      expect(res.body).toHaveProperty("name", "genres");
    });
  });
  describe("PUT /:id", () => {
    let token;
    let newName;
    let id;
    let genre;

    const exec = async () => {
      return await request(server)
        .put("/api/genres/" + id)
        .set("x-auth-token", token)
        .send({ name: newName });
    };

    beforeEach(async () => {
      genre = new Genres({ name: "genres" });
      await genre.save();

      token = new User().generateAuthToken();
      newName = "new name";
      id = genre._id;
    });

    it("should return 401 if client not logged", async () => {
      token = "";
      const res = await exec();

      expect(res.status).toBe(401);
    });
    it("should return 400 if genre is less than 4 characters", async () => {
      newName = "1234";
      const res = await exec();

      expect(res.status).toBe(400);
    });
    it("should return 400 if genre is more than 50 characters", async () => {
      newName = new Array(52).join("a");
      const res = await exec();

      expect(res.status).toBe(400);
    });
    it("should update the genre if it is valid", async () => {
      await exec();

      const genres = await Genres.findById(genre._id);

      expect(genres).not.toBeNull();
    });
    it("should return 404 if id is invalid", async () => {
      id = 1;
      const res = await exec();

      expect(res.status).toBe(404);
    });
    it("should return the updated genre if it is valid", async () => {
      const res = await exec();

      expect(res.body).toHaveProperty("_id");
      expect(res.body).toHaveProperty("name", newName);
    });
    it("should return 404 if genre with the given id was not found", async () => {
      id = new mongoose.Types.ObjectId();

      const res = await exec();

      expect(res.status).toBe(404);
    });
  });
  describe("DELETE /:id", () => {
    let genre;
    let token;
    let id;

    const exec = async () => {
      return await request(server)
        .delete("/api/genres/" + id)
        .set("x-auth-token", token)
        .send();
    };

    beforeEach(async () => {
      genre = new Genres({ name: "genre" });
      await genre.save();

      token = new User({ isAdmin: true }).generateAuthToken();
      id = genre._id;
    });

    it("should return 401 if client not logged", async () => {
      token = "";
      const res = await exec();

      expect(res.status).toBe(401);
    });
    it("should return 403 if user is not admin", async () => {
      token = new User({ isAdmin: false }).generateAuthToken();
      const res = await exec();

      expect(res.status).toBe(403);
    });
    it("should delete the genre if it is valid", async () => {
      await exec();

      const genres = await Genres.findById(genre._id);

      expect(genres).toBeNull();
    });
    it("should return 404 if id is invalid", async () => {
      id = 1;
      const res = await exec();

      expect(res.status).toBe(404);
    });
    it("should return the removed genre", async () => {
      const res = await exec();

      expect(res.body).toHaveProperty("_id", genre._id.toHexString());
      expect(res.body).toHaveProperty("name", genre.name);
    });
    it("should return 404 if genre with the given id was not found", async () => {
      id = new mongoose.Types.ObjectId();

      const res = await exec();

      expect(res.status).toBe(404);
    });
  });
});
