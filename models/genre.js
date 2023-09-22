const Joi = require('joi');
const mongoose = require('mongoose');

const genresSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minLength: 5,
        maxlength: 255,
    }
});
const Genres = mongoose.model('Genres', genresSchema)


function validateGenre(genre) {
    const schema = Joi.object({
        name: Joi.string().min(2).required(),
    })
    return schema.validate(genre)
}

module.exports = {
    Genres,
    genresSchema,
    validateGenre
}