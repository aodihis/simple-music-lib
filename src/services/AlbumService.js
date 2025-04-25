const {Pool} = require('pg');
const {nanoid} = require('nanoid');
const InvariantError = require('../exceptions/InvariantError.js');
const NotFoundError = require('../exceptions/NotFoundError.js');
const {mapAlbumDBToModel} = require('../utils/mapper.js');

class AlbumService {

    constructor() {
        this._pool = new Pool();
    }

    async getAlbums() {
        const res = await this._pool.query('SELECT * FROM albums ORDER BY created_at DESC');
        return res.rows.map(mapAlbumDBToModel);
    }

    async getById(id) {
        const res = await this._pool.query('SELECT * FROM albums WHERE id = $1', [id]);
        if (!res.rows.length) {
            throw new NotFoundError('Album not found');
        }
        return res.rows.map(mapAlbumDBToModel)[0];
    }

    async create({name, year}) {
        const id = nanoid(16);
        const createdAt = new Date().toISOString();
        const updatedAt = createdAt;
        const res = await this._pool.query(
            `INSERT INTO albums (id, name, year, created_at, updated_at)
             VALUES ($1, $2, $3, $4, $5) RETURNING *`,
            [id, name, year, createdAt, updatedAt]
        );

        if (!res.rows[0].id) {
            throw new InvariantError("Failed to create a album.");
        }
        return res.rows[0].id;
    }

    async update(id, {name, year}) {
        const updatedAt = new Date().toISOString();

        const res = await this._pool.query(
            `UPDATE albums
             SET name = $1,
                 year = $2,
                 updated_at = $3
             WHERE id = $4 RETURNING *`,
            [name, year, updatedAt, id]
        );
        if (!res.rows.length) {
            throw new NotFoundError('Cannot find album');
        }
        return res.rows[0];
    }

    async remove(id) {
        const res = await this._pool.query('DELETE FROM albums WHERE id = $1 RETURNING id', [id]);

        if (!res.rows.length) {
            throw new NotFoundError('Album not found');
        }
    }
}

module.exports = AlbumService;
