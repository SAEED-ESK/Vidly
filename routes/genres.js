const express = require("express");
const vlaidObjectId = require("../middleware/validObjectId");
const mongoose = require("mongoose");
const auth = require("../middleware/auth");
const isAdmin = require("../middleware/admin");
const { Genres, validateGenre } = require("../models/genre");
const validObjectId = require("../middleware/validObjectId");
const middleware = {
  validObjectId: validObjectId,
  auth: auth,
};

const router = express.Router();

router.get("/", async (req, res) => {
  const genres = await Genres.find().sort("name");
  res.send(genres);
});

router.get("/:id", validObjectId, async (req, res) => {
  const genre = await Genres.findById(req.params.id);
  if (!genre)
    return res.status(404).send(`Couldn't find genre: ${req.params.id}`);

  res.send(genre);
});

router.post("/", auth, async (req, res) => {
  const { error } = validateGenre(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const genre = new Genres({
    name: req.body.name,
  });
  const result = await genre.save();
  res.send(result);
});

router.put(
  "/:id",
  [middleware.auth, middleware.validObjectId],
  async (req, res) => {
    const { error } = validateGenre(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const genre = await Genres.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
      },
      {
        new: true,
      }
    );
    if (!genre)
      return res.status(404).send(`Couldn't find genre: ${req.params.id}`);

    res.send(genre);
  }
);

router.delete("/:id", [auth, isAdmin, validObjectId], async (req, res) => {
  const genre = await Genres.findByIdAndRemove(req.params.id);
  if (!genre)
    return res.status(404).send(`Couldn't find genre: ${req.params.id}`);

  res.send(genre);
});

module.exports = router;
