const request = require("supertest");
const { Rental } = require("../../models/rental");
const { User } = require("../../models/user");
const { Movies } = require("../../models/movie");
const mongoose = require("mongoose");
const moment = require("moment");

let server;
let customerId;
let movieId;
let rental;
let movie;
let token;

describe("/api/returns", () => {
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

    movie = new Movies({
      _id: movieId,
      title: "12345",
      dailyRentalRate: 2,
      genre: { name: "12345" },
      numberInStock: 10,
    });
    await movie.save();

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
    await Movies.deleteOne();
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

  it("should return 400 if the rental has already been processed", async () => {
    rental.dateReturned = new Date();
    await rental.save();

    const result = await exec();

    expect(result.status).toBe(400);
  });

  it("should return 200 if request is valid", async () => {
    const result = await exec();

    expect(result.status).toBe(200);
  });

  it("should set rental returned date", async () => {
    const result = await exec();

    const rentalDb = await Rental.findById(rental._id);
    const diff = new Date() - rentalDb.dateReturned;

    expect(diff).toBeLessThan(10 * 1000);
  });

  it("calculate the rental fee", async () => {
    rental.dateOut = moment().add(-7, "days").toDate();
    await rental.save();

    await exec();

    const rentalDb = await Rental.findById(rental._id);

    expect(rentalDb.rentalFee).toBe(14);
  });

  it("should increase the movie if input is vlaid", async () => {
    const result = await exec();

    const movieDb = await Movies.findById(movieId);

    expect(movieDb.numberInStock).toBe(movie.numberInStock + 1);
  });

  it("should return rental if it is valid", async () => {
    const result = await exec();

    //   expect(result.body).toHaveProperty("dateOut");
    //   expect(result.body).toHaveProperty("dateReturned");
    //   expect(result.body).toHaveProperty("rentalFee");
    //   expect(result.body).toHaveProperty("customer");
    //   expect(result.body).toHaveProperty("movie");

    expect(Object.keys(result.body)).toEqual(
      expect.arrayContaining([
        "customer",
        "movie",
        "rentalFee",
        "dateOut",
        "dateReturned",
      ])
    );
  });
});
