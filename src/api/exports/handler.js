class ExportsHandler {
    constructor(service, playlistService, validator) {
        this._service = service;
        this._playlistService = playlistService;
        this._validator = validator;

        this.postExportNotesHandler = this.postExportNotesHandler.bind(this);
    }

    async postExportNotesHandler(request, h) {
        this._validator.validateExportPlaylistPayload(request.payload);

        const {id: playlistId} = request.params;
        const {id: userId} = request.auth.credentials;

        await this._playlistService.verifyPlaylistOwner(playlistId, userId);

        const message = {
            playlistId,
            targetEmail: request.payload.targetEmail,
        };

        await this._service.sendMessage('export:playlists', JSON.stringify(message));

        const response = h.response({
            status: 'success',
            message: 'Export in progress',
        });
        response.code(201);
        return response;
    }
}

module.exports = ExportsHandler;