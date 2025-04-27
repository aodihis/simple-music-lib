const Joi = require('joi');

const UserPayloadSchema = Joi.object({
    name: Joi.string().required(),
});

module.exports = {UserPayloadSchema};