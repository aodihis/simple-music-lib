// src/api/playlists/handler.js

class PlaylistsHandler {
    constructor(service, validator) {
        this._service = service;
        this._validator = validator;

        this.createPlaylist = this.createPlaylist.bind(this);
        this.getPlaylists = this.getPlaylists.bind(this);
        this.deletePlaylist = this.deletePlaylist.bind(this);
        this.addSong = this.addSong.bind(this);
        this.getSongs = this.getSongs.bind(this);
        this.deleteSong = this.deleteSong.bind(this);
    }

    async createPlaylist(request, h) {
        this._validator.validatePlaylistPayload(request.payload);

        const {id: userId} = request.auth.credentials;
        const {name} = request.payload;

        const playlistId = await this._service.addPlaylist({name, owner:userId});

        const response = h.response({
            status: 'success',
            message: 'Playlist created successfully',
            data: {
                playlistId,
            },
        });
        response.code(201);
        return response;
    }

    async getPlaylists(request, h) {
        const {id: userId} = request.auth.credentials;
        const playlists = await this._service.getPlaylists(userId);

        return {
            status: 'success',
            data: {
                playlists,
            },
        };
    }

    async deletePlaylist(request, h) {
        const {id} = request.params;
        const {id: userId} = request.auth.credentials;

        await this._service.verifyPlaylistOwner(id, userId);
        await this._service.deletePlaylist(id);

        return {
            status: 'success',
            message: 'Playlist deleted successfully',
        };
    }

    async addSong(request, h) {
        const {id} = request.params;
        this._validator.validatePlaylistSongPayload(request.payload);
        const {songId} = request.payload;
        const {id: userId} = request.auth.credentials;
        await this._service.verifyPlaylistAccess(id, userId);
        await this._service.addSongToPlaylist(id, songId);

        const response = h.response({
            status: 'success',
            message: 'Playlist added successfully',
        })
        response.code(201);
        return response;

    }

    async getSongs(request, h) {
        const {id: userId} = request.auth.credentials;
        const {id} = request.params;

        await this._service.verifyPlaylistAccess(id, userId);

        const playlist = await this._service.getSongsInPlaylist(id);
        return {
            status: 'success',
            data: {
                playlist
            },
        };
    }

    async deleteSong(request, h) {
        const {id: playlistId} = request.params;
        const {id: userId} = request.auth.credentials;

        const {songId} = request.payload;
        await this._service.verifyPlaylistOwner(playlistId, userId);
        await this._service.deleteSongFromPlaylist(playlistId, songId);

        return {
            status: 'success',
            message: 'Song deleted successfully',
        };
    }
}

module.exports = PlaylistsHandler;
