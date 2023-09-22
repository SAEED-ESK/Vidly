const config = require('config');
const jwt = require('jsonwebtoken')
const express = require('express');
const mongoose = require('mongoose');
const _ = require('lodash');
const bcrypt = require('bcrypt');
const Joi = require('joi');
const {
    User
} = require('../models/user');
const {
    jwtPrivateKey
} = require('../config/secret');


const router = express.Router();

router.post('/', async (req, res) => {
    const {
        error
    } = validate(req.body)
    if (error) return res.status(400).send(error.details[0].message)

    let user = await User.findOne({
        email: req.body.email
    })
    if (!user) return res.status(400).send('Invalid email or password')

    const validPassword = await bcrypt.compare(req.body.password, user.password)
    if (!validPassword) return res.status(400).send('Invalid email or password')

    const token = user.generateAuthToken()
    res.header('x-auth-token', token).send(_.pick(user, ['name', 'email']))
})

function validate(req) {
    const schema = Joi.object({
        email: Joi.string().min(5).max(255).email().required(),
        password: Joi.string().min(8).max(1024).required()
    })
    return schema.validate(req)
}

module.exports = router;