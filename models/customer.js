const mongoose = require('mongoose');
const joi = require('joi');

const customerSchema = new mongoose.Schema({
    name: {
        type: 'string',
        required: true,
        min: 5,
        max: 255
    },
    isGold: {
        type: 'boolean',
        default: false,
    },
    phone: {
        type: "string",
        required: true,
        length: 11
    },
})

const Customer = mongoose.model('Customer', customerSchema)

const validateCustomer = function (customer) {
    const schema = joi.object({
        name: joi.string().min(5).max(255).required(),
        isGold: joi.boolean(),
        phone: joi.string().length(11).required(),
    })
    return schema.validate(customer)
}

module.exports = {
    Customer,
    validateCustomer
}