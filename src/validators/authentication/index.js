const InvariantError = require('../../exceptions/InvariantError');
const {
    AuthenticationPostPayloadSchema,
    AuthenticationPutPayloadSchema,
    AuthenticationDeletePayloadSchema
} = require('./schema');

const AuthenticationValidator = {
    validateAuthenticationPostPayload: (payload) => {
        const validationResult = AuthenticationPostPayloadSchema.validate(payload);
        if (validationResult.error) {
            throw new InvariantError(validationResult.error.message);
        }
    },
    validateAuthenticationPutPayload: (payload) => {
        const validationResult = AuthenticationPutPayloadSchema.validate(payload);
        if (validationResult.error) {
            throw new InvariantError(validationResult.error.message);
        }
    },
    validateAuthenticationDeletePayload: (payload) => {
        const validationResult = AuthenticationDeletePayloadSchema.validate(payload);
        if (validationResult.error) {
            throw new InvariantError(validationResult.error.message);
        }
    },
};

module.exports = AuthenticationValidator;