// playlistService.js
const {nanoid} = require('nanoid');
const InvariantError = require('../exceptions/InvariantError.js');
const NotFoundError = require('../exceptions/NotFoundError.js');
const AuthenticationError = require('../exceptions/AuthenticationError.js');
const {mapPlaylistDBToModel} = require("../utils/mapper");
const {Pool} = require("pg");
const AuthorizationError = require("../exceptions/AuthorizationError");

class PlaylistService {
    constructor() {
        this._pool = new Pool();
    }

    async addPlaylist({name, owner}) {
        const id = nanoid(16);
        const createdAt = new Date().toISOString();

        const query = {
            text: 'INSERT INTO playlists (id, name, owner, created_at, updated_at) VALUES ($1, $2, $3, $4, $5) RETURNING id',
            values: [id, name, owner, createdAt, createdAt],
        };

        const result = await this._pool.query(query);

        return result.rows[0].id;
    }

    async getPlaylists(owner) {
        const query = {
            text: `
                SELECT playlists.id,
                       playlists.name,
                       playlists.owner,
                       users.username,
                       playlists.created_at,
                       playlists.updated_at
                FROM playlists
                         JOIN users ON playlists.owner = users.id
                WHERE playlists.owner = $1
            `,
            values: [owner]
        };
        const result = await this._pool.query(query);
        return result.rows.map(mapPlaylistDBToModel);
    }

    async getPlaylistById(id) {
        const query = {
            text: 'SELECT id, name, owner, created_at, updated_at FROM playlists WHERE id = $1',
            values: [id],
        };

        const result = await this._pool.query(query);

        if (!result.rowCount) {
            throw new InvariantError('Playlist not found');
        }

        return result.rows[0];
    }

    async deletePlaylist(id) {
        const query = {
            text: 'DELETE FROM playlists WHERE id = $1 RETURNING id',
            values: [id],
        };

        const result = await this._pool.query(query);

        if (!result.rowCount) {
            throw new InvariantError('Failed to delete playlist. Id not found.');
        }

        return result.rows[0].id;
    }

    async addSongToPlaylist(playlistId, songId) {
        const id = nanoid(16);
        const createdAt = new Date().toISOString();
        const query = {
            text: 'INSERT INTO playlist_songs (id, playlist_id, song_id, created_at, updated_at) VALUES ($1, $2, $3, $4, $5) RETURNING id',
            values: [id, playlistId, songId, createdAt, createdAt],
        };

        try {
            const result = await this._pool.query(query);
            return result.rows[0].id;
        } catch (error) {
            if (error.code === "23503") {
                throw new NotFoundError("Invalid Playlist ID or Song ID");
            }
            throw error;
        }
    }

    async getSongsInPlaylist(id) {
        const playlistQuery = {
            text: `
                SELECT playlists.id, playlists.name, users.username
                FROM playlists
                         JOIN users ON playlists.owner = users.id
                WHERE playlists.id = $1
            `,
            values: [id],
        };

        const playlistResult = await this._pool.query(playlistQuery);

        if (!playlistResult.rowCount) {
            throw new Error('Playlist not found');
        }

        const playlist = playlistResult.rows[0];

        const songsQuery = {
            text: `
                SELECT songs.id, songs.title, songs.performer
                FROM playlist_songs
                         LEFT JOIN songs ON playlist_songs.song_id = songs.id
                WHERE playlist_songs.playlist_id = $1
            `,
            values: [id],
        };

        const songsResult = await this._pool.query(songsQuery);

        return {
            id: playlist.id,
            name: playlist.name,
            username: playlist.username,
            songs: songsResult.rows,
        };
    }


    async deleteSongFromPlaylist(playlistId, songId) {
        const query = {
            text: 'DELETE FROM playlist_songs WHERE playlist_id = $1 AND song_id = $2  RETURNING id',
            values: [playlistId, songId],
        }

        const result = await this._pool.query(query);

        if (!result.rows.length) {
            throw new InvariantError('Failed to delete song from playlist. Id not found.');
        }

        return result.rows[0].id;
    }

    async verifyPlaylistOwner(id, owner) {
        const query = {
            text: 'SELECT * FROM playlists WHERE id = $1',
            values: [id],
        }

        const res = await this._pool.query(query);

        if (!res.rows.length) {
            throw new NotFoundError('Playlist not found');
        }

        if (res.rows[0].owner !== owner) {
            throw new AuthorizationError('Forbidden');
        }

    }

    // just add this, maybe need to expand in the future.
    async verifyPlaylistAccess(id, owner) {
        await this.verifyPlaylistOwner(id, owner);
    }
}

module.exports = PlaylistService;
