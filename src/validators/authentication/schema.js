const Joi = require('joi');

const AuthenticationPostPayloadSchema = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required(),
});

const AuthenticationPutPayloadSchema = Joi.object({
    refreshToken: Joi.string().required(),
});

const AuthenticationDeletePayloadSchema = Joi.object({
    refreshToken: Joi.string().required(),
});

module.exports = {AuthenticationPostPayloadSchema, AuthenticationPutPayloadSchema, AuthenticationDeletePayloadSchema};