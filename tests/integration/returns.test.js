const request = require("supertest");
const { Rental } = require("../../models/rental");
const { User } = require("../../models/user");
const mongoose = require("mongoose");

describe("/api/returns", () => {
  let server;
  let customerId;
  let movieId;
  let rental;
  let token;

  const exec = () => {
    return request(server)
      .post("/api/returns")
      .set("x-auth-token", token)
      .send({ customerId, movieId });
  };

  beforeEach(async () => {
    server = require("../../app");

    customerId = new mongoose.Types.ObjectId();
    movieId = new mongoose.Types.ObjectId();
    token = new User().generateAuthToken();

    rental = new Rental({
      customer: {
        _id: customerId,
        name: "12345",
        phone: "12345",
      },
      movie: {
        _id: movieId,
        title: "12345",
        dailyRentalRate: 2,
      },
    });
    await rental.save();
  });
  afterEach(async () => {
    await server.close();
    await Rental.deleteOne();
  });

  it("should return 401 if client not logged in", async () => {
    token = "";

    const result = await exec();

    expect(result.status).toBe(401);
  });

  it("should return 400 if customerId is not provided", async () => {
    customerId = "";

    const result = await exec();

    expect(result.status).toBe(400);
  });

  it("should return 400 if movieId is not provided", async () => {
    movieId = "";

    const result = await exec();

    expect(result.status).toBe(400);
  });

  it("should return 404 if no rental found for this customer/movie", async () => {
    await Rental.deleteOne();

    const result = await exec();

    expect(result.status).toBe(404);
  });
});
