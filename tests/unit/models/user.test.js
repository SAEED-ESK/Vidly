const { User } = require("../../../models/user");
const jwt = require("jsonwebtoken");
// const config = require("config");
const mongoose = require("mongoose");

describe("user.generateAuthToken", () => {
  it("should generate a valid jwt", () => {
    const payload = {
      _id: new mongoose.Types.ObjectId().toHexString(),
      isAdmin: true,
    };
    const user = new User(payload);
    const token = user.generateAuthToken();
    const decode = jwt.verify(token, "mySecureKey");
    expect(decode).toMatchObject(payload);
  });
});
