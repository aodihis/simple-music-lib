const {Pool} = require("pg");
const InvariantError = require("../exceptions/InvariantError");

const CACHE_DURATION = 1800;
class LikeService {
    constructor(cacheService) {
        this._pool = new Pool();
        this._cacheService = cacheService;
    }
    
    async createLike(userId, albumId) {
        try {
            await this._pool.query(
                'INSERT INTO user_album_likes(user_id, album_id) VALUES($1, $2)',
                [userId, albumId]
            );
            this._cacheService.delete(`albums::${albumId}`);
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
        this._cacheService.delete(`albums::${albumId}`);
    }


    async getLikeCount(albumId) {
        try {
            const likes = this._cacheService.get(`albums::${albumId}`);
            return {
                cache: true,
                likes: likes
            }
        } catch (_) {
        }
        const result = await this._pool.query(
            'SELECT COUNT(*) as likes FROM user_album_likes WHERE album_id = $1',
            [albumId]
        );

        if (!result.rows.length) {
            throw new InvariantError('Album not found');
        }
        const likes = result.rows[0].likes;
        this._cacheService.set(`albums::${albumId}`, likes, CACHE_DURATION);

        return {
            cache: false,
            likes: likes
        };
    }
}

module.exports = LikeService;