const mongoose = require("mongoose");
const Joi = require("joi");

const rentalSchema = new mongoose.Schema({
  customer: {
    type: new mongoose.Schema({
      name: {
        type: "string",
        required: true,
        min: 5,
        max: 255,
      },
      isGold: {
        type: "boolean",
        default: false,
      },
      phone: {
        type: "string",
        required: true,
        length: 11,
      },
    }),
    required: true,
  },
  movie: {
    type: new mongoose.Schema({
      title: {
        type: "string",
        required: true,
        trim: true,
        min: 5,
        max: 255,
      },
      dailyRentalRate: {
        type: Number,
        required: true,
        min: 0,
        max: 255,
      },
    }),
    require: true,
  },
  dateOut: {
    type: Date,
    required: true,
    default: Date.now(),
  },
  dateReturned: {
    type: Date,
  },
  rentalFee: {
    type: Number,
    min: 0,
  },
});

rentalSchema.statics.lookup = function (customerId, movieId) {
  return this.findOne({
    "customer._id": customerId,
    "movie._id": movieId,
  });
};

const Rental = mongoose.model("rental", rentalSchema);

function rentalValidation(rental) {
  const schema = Joi.object({
    customerId: Joi.objectId().required(),
    movieId: Joi.objectId().required(),
  });
  return schema.validate(rental);
}

module.exports = {
  Rental,
  rentalValidation,
};
