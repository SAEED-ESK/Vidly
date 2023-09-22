const mongoose = require('mongoose');
const Joi = require('joi');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    name: {
        type: 'string',
        required: true,
        min: 5,
        max: 50
    },
    email: {
        type: 'string',
        required: true,
        unique: true,
        min: 5,
        max: 255
    },
    password: {
        type: 'string',
        required: true,
        min: 8,
        max: 1024
    },
    isAdmin: Boolean,
});


userSchema.methods.generateAuthToken = function () {
    const token = jwt.sign({
        _id: this._id,
        isAdmin: this.isAdmin
    }, 'mySecureKey')
    return token
}

const User = mongoose.model('users', userSchema)

function validateUser(user) {
    const schema = Joi.object({
        name: Joi.string().min(5).max(50).required(),
        email: Joi.string().min(5).max(255).email().required(),
        password: Joi.string().min(8).max(1024).required()
    })
    return schema.validate(user)
}

module.exports = {
    User,
    validateUser
};