const mongoose = require('mongoose');
const joi = require('joi');
const {
    genresSchema
} = require('./genre');
const Joi = require('joi');

const movieSchema = new mongoose.Schema({
    title: {
        type: 'string',
        required: true,
        trim: true,
        min: 5,
        max: 255
    },
    genre: {
        type: genresSchema,
        required: true,
    },
    numberInStock: {
        type: Number,
        required: true,
        min: 0,
        max: 255
    },
    dailyRentalRate: {
        type: Number,
        required: true,
        min: 0,
        max: 255
    }
})

const Movies = mongoose.model('Movies', movieSchema)

function movieValidation(movie) {
    const schema = Joi.object({
        title: Joi.string().required(),
        genreId: Joi.objectId().required(),
        numberInStock: Joi.number().required(),
        dailyRentalRate: Joi.number().required(),
    })
    return schema.validate(movie)
}

module.exports = {
    Movies,
    movieValidation
}