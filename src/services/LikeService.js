const {Pool} = require("pg");
const InvariantError = require("../exceptions/InvariantError");

class LikeService {
    constructor() {
        this._pool = new Pool();
    }
    
    async createLike(userId, albumId) {
        try {
            await this._pool.query(
                'INSERT INTO user_album_likes(user_id, album_id) VALUES($1, $2)',
                [userId, albumId]
            );

        } catch (error) {
            if (error.code === '23505') {
                throw InvariantError("Album already liked");
            }

            // Handle foreign key violation (album not found)
            if (error.code === '23503') {
                throw new InvariantError('Album not found');
            }

            throw error;
        }
    }


    async deleteLike(userId, albumId) {
        await this._pool.query(
            'DELETE FROM user_album_likes WHERE user_id = $1 AND album_id = $2',
            [userId, albumId]
        );
    }


    async getLikeCount(albumId) {
        const result = await this._pool.query(
            'SELECT COUNT(*) as likes FROM user_album_likes WHERE album_id = $1',
            [albumId]
        );

        if (!result.rows.length) {
            throw new InvariantError('Album not found');
        }

        return result.rows[0].likes;
    }
}

module.exports = LikeService;