class AuthenticationsHandler {
    constructor(authenticationsService, usersService, tokenManager, validator) {
        this._authenticationsService = authenticationsService;
        this._usersService = usersService;
        this._tokenManager = tokenManager;
        this._validator = validator;

        this.postAuthenticationHandler = this.postAuthenticationHandler.bind(this);
        this.putAuthenticationHandler = this.putAuthenticationHandler.bind(this);
        this.deleteAuthenticationHandler = this.deleteAuthenticationHandler.bind(this);
    }

    async postAuthenticationHandler(request, h) {
        this._validator.validateAuthenticationPostPayload(request.payload);

        const {username, password} = request.payload;
        const id = await this._usersService.verifyCredential(username, password);

        const accessToken = this._tokenManager.generateAccessToken({id});
        const refreshToken = this._tokenManager.generateRefreshToken({id});

        await this._authenticationsService.addRefreshToken(refreshToken);

        const response = h.response({
            status: 'success',
            message: 'Authentication success',
            data: {
                accessToken,
                refreshToken,
            },
        });
        response.code(201);
        return response;
    }

    async putAuthenticationHandler(request, _) {
        this._validator.validateAuthenticationPutPayload(request.payload);

        const {refreshToken} = request.payload;
        await this._authenticationsService.verifyRefreshToken(refreshToken);
        const {id} = this._tokenManager.verifyRefreshToken(refreshToken);

        const accessToken = this._tokenManager.generateAccessToken({id});
        return {
            status: 'success',
            message: 'Access Token refreshed',
            data: {
                accessToken,
            },
        };
    }

    async deleteAuthenticationHandler(request, _) {
        this._validator.validateAuthenticationDeletePayload(request.payload);

        const {refreshToken} = request.payload;
        await this._authenticationsService.verifyRefreshToken(refreshToken);
        await this._authenticationsService.deleteRefreshToken(refreshToken);

        return {
            status: 'success',
            message: 'Refresh token deleted',
        };
    }
}

module.exports = AuthenticationsHandler;