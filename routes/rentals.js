const mongoose = require('mongoose');
const express = require('express');
const Fawn = require('fawn');
const {
    Customer,
    validateCustomer
} = require('../models/customer');
const {
    Rental,
    rentalValidation
} = require('../models/rental')
const {
    Movies,
    movieValidation
} = require('../models/movie')

const router = express.Router();

Fawn.init("mongodb://0.0.0.0:27017/Vildy")

router.get('/', async (req, res) => {
    const rental = await Rental.find()
    res.send(rental)
})

router.post('/', async (req, res) => {
    const {
        error
    } = rentalValidation(req.body)
    if (error) return res.status(400).send(error.details[0].message)

    const customer = await Customer.findById(req.body.customerId);
    if (!customer) return res.status(400).send('Invalid genre!')

    const movie = await Movies.findById(req.body.movieId);
    if (!movie) return res.status(400).send('Invalid genre!')

    let rental = new Rental({
        customer: {
            _id: customer._id,
            name: customer.name,
            phone: customer.phone
        },
        movie: {
            _id: movie._id,
            title: movie.title,
            dailyRentalRate: movie.dailyRentalRate,
        }
    })
    try {
        new Fawn.Task()
            .save('rentals', rental)
            .update('movies', {
                _id: movie._id
            }, {
                $inc: {
                    numberInStock: -1
                }
            }).run()

        res.send(rental);
    } catch (error) {
        res.status(500).send('Sth Failed')
    }
})

module.exports = router;