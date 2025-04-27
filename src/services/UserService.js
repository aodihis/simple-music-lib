// userService.js
const bcrypt = require('bcrypt');
const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const InvariantError = require('../exceptions/InvariantError');
const NotFoundError = require('../exceptions/NotFoundError');
const AuthenticationError = require('../exceptions/AuthenticationError');

class UserService {
    constructor() {
        this._pool = new Pool();
    }

    async addUser({ username, password, fullname }) {
        const hashedPassword = await bcrypt.hash(password, 10);
        const id = nanoid(16);
        const query = {
            text: 'INSERT INTO users (id, username, password, fullname) VALUES ($1, $2, $3, $4) RETURNING id',
            values: [id, username, hashedPassword, fullname],
        };

        try {
            const result = await this._pool.query(query);
            if (!result.rows.length) {
                throw new InvariantError("Failed to add user");
            }
            return result.rows[0].id;
        } catch (error) {
            if (error.code === '23505') {
                throw new InvariantError('Username already taken');
            }
            throw error;
        }
    }

    async verifyCredential(username, password) {
        const query = {
            text: 'SELECT id, password FROM users WHERE username = $1',
            values: [username],
        };

        const result = await this._pool.query(query);

        if (!result.rowCount) {
            throw new AuthenticationError('Invalid credentials');
        }

        const { id, password: hashedPassword } = result.rows[0];
        const match = await bcrypt.compare(password, hashedPassword);

        if (!match) {
            throw new AuthenticationError('Invalid credentials');
        }

        return id;
    }

    async getUserById(id) {
        const query = {
            text: 'SELECT id, username, fullname FROM users WHERE id = $1',
            values: [id],
        };

        const result = await this._pool.query(query);

        if (!result.rowCount) {
            throw new NotFoundError('User not found');
        }

        return result.rows[0];
    }
}

module.exports = UserService;
