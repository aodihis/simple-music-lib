const {Pool} = require('pg');
const {nanoid} = require('nanoid');
const InvariantError = require('../exceptions/InvariantError');
const NotFoundError = require('../exceptions/NotFoundError');
const {mapSongDBToModel, mapSongsDBToModel} = require("../utils/mapper");

class SongService {
    _pool;

    constructor() {
        this._pool = new Pool();
    }

    async getSongs() {
        const res = await this._pool.query('SELECT * FROM songs ORDER BY created_at DESC');
        return res.rows.map(mapSongsDBToModel);
    }

    async getById(id) {
        const res = await this._pool.query('SELECT * FROM songs WHERE id = $1', [id]);
        if (!res.rows.length) {
            throw new NotFoundError('Song not found');
        }
        return res.rows.map(mapSongDBToModel)[0];
    }

    async create({albumId, title, year, genre, performer, duration}) {
        const id = nanoid(16);
        const createdAt = new Date().toISOString();
        const res = await this._pool.query(
            `INSERT INTO songs (id, album_id, title, year, genre, performer, duration, created_at, updated_at)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
            [id, albumId, title, year, genre, performer, duration, createdAt, createdAt]
        );

        if (!res.rows[0].id) {
            throw new InvariantError("Failed to create a album.");
        }

        return res.rows[0].id;
    }

    async update(id, {albumId, title, year, genre, performer, duration}) {
        const updatedAt = new Date().toISOString();

        const res = await this._pool.query(
            `UPDATE songs
             SET album_id   = $1,
                 title      = $2,
                 year       = $3,
                 genre      = $4,
                 performer  = $5,
                 duration   = $6,
                 updated_at = $7
             WHERE id = $8 RETURNING *`,
            [albumId, title, year, genre, performer, duration, updatedAt, id]
        );

        if (!res.rows.length) {
            throw new NotFoundError('Cannot find album');
        }

        return res.rows[0];
    }

    async remove(id) {
        const res = await this._pool.query('DELETE FROM songs WHERE id = $1 RETURNING id', [id]);
        if (!res.rows.length) {
            throw new NotFoundError('Song not found');
        }
    }
}

module.exports = SongService;
