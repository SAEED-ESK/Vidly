const { Rental } = require("../models/rental");
const { Movies } = require("../models/movie");
const auth = require("../middleware/auth");
const validate = require("../middleware/validate");
const Joi = require("joi");
const express = require("express");
const moment = require("moment");

const router = express.Router();

router.post("/", [auth, validate(validateReturn)], async (req, res) => {
  const rental = await Rental.lookup(req.body.customerId, req.body.movieId);
  if (!rental) return res.status(404).json({ message: "No rental found" });

  if (rental.dateReturned)
    return res.status(400).json({ message: "rental already processed" });

  rental.dateReturned = new Date();
  rentalDays = moment().diff(rental.dateOut, "days");
  rental.rentalFee = rentalDays * rental.movie.dailyRentalRate;

  const result = await rental.save();

  await Movies.findByIdAndUpdate(rental.movie._id, {
    $inc: { numberInStock: 1 },
  });

  res.status(200).send(result);
});

function validateReturn(req) {
  const schema = Joi.object({
    customerId: Joi.objectId().required(),
    movieId: Joi.objectId().required(),
  });
  return schema.validate(req);
}

module.exports = router;
