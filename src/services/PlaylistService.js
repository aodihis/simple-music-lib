// playlistService.js
const { nanoid } = require('nanoid');
const InvariantError = require('../exceptions/InvariantError.js');
const {mapPlaylistDBToModel} = require("../utils/mapper");

class PlaylistService {
    constructor(pool) {
        this._pool = pool;
    }

    async addPlaylist({ name, owner }) {
        const id = nanoid(16);
        const createdAt = new Date().toISOString();
        const query = {
            text: 'INSERT INTO playlists (id, name, owner, created_at, updated_at) VALUES ($1, $2, $3, $4, $5) RETURNING id',
            values: [id, name, owner, createdAt, createdAt],
        };

        const result = await this._pool.query(query);

        return result.rows[0].id;
    }

    async getPlaylists() {
        const query = {
            text: `
              SELECT playlists.id, playlists.name, playlists.owner, users.username, playlists.created_at, playlists.updated_at
              FROM playlists
              JOIN users ON playlists.owner = users.id
            `,
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

    async addSongToPlaylist({playlistId, songId}) {
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
                throw new InvariantError("Invalid Playlist ID or Song ID");
            }
            throw error;
        }
    }

    async getSongsInPlaylist(id) {
        const query = {
            text: 'SELECT title, performer FROM playlist_songs LEFT JOIN songs ON playlist_songs.song_id = songs.id WHERE playlist_id = $1',
            values: [id],
        }

        const res = await this._pool.query(query);
        return res.rows;
    }

    async deleteSongFromPlaylist(id) {
        const query = {
            text: 'DELETE FROM playlist_songs WHERE id = $1 RETURNING id',
            values: [id],
        }

        const result = await this._pool.query(query);

        if (!result.rowCount) {
            throw new InvariantError('Failed to delete song from playlist. Id not found.');
        }

        return result.rows[0].id;
    }
}

module.exports = PlaylistService;
