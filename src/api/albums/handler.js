class albumHandler {

    constructor(service, validator) {
        this._service = service;
        this._validator = validator;

        this.getAlbumsHandler = this.getAlbumsHandler.bind(this);
        this.getAlbumHandler = this.getAlbumHandler.bind(this);
        this.createAlbumHandler = this.createAlbumHandler.bind(this);
        this.updateAlbumHandler = this.updateAlbumHandler.bind(this);
        this.deleteAlbumHandler = this.deleteAlbumHandler.bind(this);
    }

    async getAlbumsHandler(request, h) {
        const albums = await this._service.getAlbums();
        return {
            status: "success",
            data: albums,
        }
    }

    async getAlbumHandler(request, h) {
        const album = await this._service.getById(request.params.id);
        return {
            status: "success",
            data: {
                album
            },
        };
    }

    async createAlbumHandler(request, h) {
        this._validator.validateAlbumPayload(request.payload);
        const {name, year} = request.payload;
        const id = await this._service.create({name, year});
        const res = h.response({
            status: 'success',
            message: 'Album created',
            data: {
                albumId: id,
            },
        });
        res.code(201);
        return res;
    }

    async updateAlbumHandler(request, h) {
        this._validator.validateAlbumPayload(request.payload);
        const {id} = request.params;

        await this._service.update(id, request.payload);
        return h.response({
            status: "success",
            message: 'Album updated',
        });
    }

    async deleteAlbumHandler(request, h) {
        const {id} = request.params;
        await this._service.remove(id);
        return h.response({
            status: "success",
            message: 'Album deleted',
        })
    }
}

module.exports = albumHandler;
