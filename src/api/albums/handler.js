class albumHandler {

    constructor(service, likeService, validator) {
        this._service = service;
        this._likeService = likeService;
        this._validator = validator;

        this.getAlbumsHandler = this.getAlbumsHandler.bind(this);
        this.getAlbumHandler = this.getAlbumHandler.bind(this);
        this.createAlbumHandler = this.createAlbumHandler.bind(this);
        this.updateAlbumHandler = this.updateAlbumHandler.bind(this);
        this.deleteAlbumHandler = this.deleteAlbumHandler.bind(this);
        this.uploadCoverAlbumHandler = this.uploadCoverAlbumHandler.bind(this);
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

    async uploadCoverAlbumHandler(request, h) {
        const {id} = request.params;
        const {cover} = request.payload;
        this._validator.validateCoverHeaders(cover.hapi.headers);

        await this._service.addCoverToAlbum(id,cover)

        const res = h.response({
            status: "success",
            message: 'Album uploaded',
        })
        res.code(201);
        return res;
    }

    async likeAlbumHandler(request, h) {
        const {id: userId} = request.auth.credentials;
        const {id: albumId} = request.params;

        await this._likeService.createLike(userId, albumId);

        const res = h.response({
            status: "success",
            message: 'Album liked',
        })
        res.code(201);
        return res;
    }

    async dislikeAlbumHandler(request, h) {
        const {id: userId} = request.auth.credentials;
        const {id: albumId} = request.params;

        await this._likeService.deleteLike(userId, albumId);

        return {
            status: "success",
            message: 'Album disliked successfully',
        }
    }

    async getLikesHandler(request, h) {
        const {id: userId} = request.auth.credentials;
        const {id: albumId} = request.params;

        const {cache, likes} = await this._likeService.getLikeCount(userId, albumId);

        const res =  h.response({
            status: "success",
            data: {likes},
        });

        if (cache) {
            res.header("X-Data-Source", "cache");
        }
        return res;
    }


}

module.exports = albumHandler;
