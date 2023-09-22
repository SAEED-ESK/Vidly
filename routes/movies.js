const mongoose = require('mongoose');
const express = require('express');
const {
    Movies,
    movieValidation
} = require('../models/movie')
const {
    Genres,
    validateGenre
} = require('../models/genre')

const router = express.Router();

router.get('/', async (req, res) => {
    const movie = await Movies.find()
    res.send(movie)
})

router.post('/', async (req, res) => {
    const {
        error
    } = movieValidation(req.body)
    if (error) return res.status(400).send(error.details[0].message)

    const genre = await Genres.findById(req.body.genreId);
    if (!genre) return res.status(400).send('Invalid genre!')

    const movie = new Movies({
        title: req.body.title,
        genre: {
            _id: genre._id,
            name: genre.name
        },
        numberInStock: req.body.numberInStock,
        dailyRentalRate: req.body.dailyRentalRate
    })
    await movie.save()
    res.send(movie)
})

router.put('/:id', async (req, res) => {
    const {
        error
    } = movieValidation(req.body)
    if (error) return res.status(400).send(error.details[0].message)

    const genre = await Genres.findById(req.body.genreId);
    if (!genre) return res.status(400).send('Invalid genre!')

    const movie = await Movies.findByIdAndUpdate(req.body.id, {
        title: req.body.title,
        genre: {
            _id: genre._id,
            name: genre.name
        },
        numberInStock: req.body.numberInStock,
        dailyRentalRate: req.body.dailyRentalRate
    }, {
        new: true
    });
    if (!movie) return res.status(404).send('Movie not found!')


    res.send(movie)
})

router.delete('/:id', async (req, res) => {
    const movie = await Genres.findByIdAndRemove(req.body.genreId);
    if (!movie) return res.status(404).send('Movie not found!')


    res.send(movie)
})

module.exports = router