class SongHandler  {

    constructor(service, validator) {
        this._service = service;
        this._validator = validator;

        this.getSongsHandler = this.getSongsHandler.bind(this);
        this.getSongHandler = this.getSongHandler.bind(this);
        this.createSongHandler = this.createSongHandler.bind(this);
        this.updateSongHandler = this.updateSongHandler.bind(this);
        this.deleteSongHandler = this.deleteSongHandler.bind(this);
    }

    async getSongsHandler(request, h) {
        const songs = await this._service.getSongs();
        return {
            status: "success",
            data: {
                songs
            },
        }
    }

    async getSongHandler(request, h) {
        const song = await  this._service.getById(request.params.id);
        return {
            status: "success",
            data: {
                song
            },
        };
    }

    async createSongHandler(request, h) {
        this._validator.validateSongPayload(request.payload);
        const {name, year} = request.payload;
        const id = await this._service.create(request.payload);
        const res = h.response({
            status: 'success',
            message: 'Song created',
            data: {
                songId: id,
            },
        });
        res.code(201);
        return res;
    }

    async updateSongHandler(request, h) {
        this._validator.validateSongPayload(request.payload);
        const { id } = request.params;

        await this._service.update(id, request.payload);
        return h.response({
            status: "success",
            message: 'Song updated',
        });
    }

    async deleteSongHandler(request, h) {
        const { id } = request.params;
        await this._service.remove(id);
        return h.response({
            status: "success",
            message: 'Song deleted',
        })
    }
}

module.exports = SongHandler;
