// songModel.js
import pool from '../configs/dbConfig.js';

class songModel {
    async createSong(name, artistId, releaseDate) {
        const query = `
            INSERT INTO songs (name, artist_id, created_at)
            VALUES ($1, $2, $3)
            RETURNING *
        `;
        try {
            const result = await pool.query(query, [name, artistId, releaseDate]);
            return result.rows[0];
        } catch (error) {
            throw new Error(`Error creating song: ${error.message}`);
        }
    }

    async getAllSongs() {
        const query = `
            SELECT s.id, s.name, u.name AS artist
            FROM songs s
            JOIN users u ON s.artist_id = u.id
            ORDER BY s.id
        `;
        try {
            const result = await pool.query(query);
            return result.rows;
        } catch (error) {
            throw new Error(`Error getting all songs: ${error.message}`);
        }
    }

    async findSongById(id) {
        const query = `
            SELECT * FROM songs WHERE id = $1
        `;
        try {
            const result = await pool.query(query, [id]);
            return result.rows[0];
        } catch (error) {
            throw new Error(`Error finding song by id: ${error.message}`);
        }
    }

    async findSongsByArtistId(artistId) {
        const query = `
            SELECT * FROM songs WHERE artist_id = $1
        `;
        try {
            const result = await pool.query(query, [artistId]);
            return result.rows;
        } catch (error) {
            throw new Error(`Error finding songs by artist id: ${error.message}`);
        }
    }

    async updateSong(id, name, artistId) {
        const query = `
            UPDATE songs
            SET name = $1, artist_id = $2, updated_at = $3
            WHERE id = $4
            RETURNING *
        `;
        try {
            const result = await pool.query(query, [name, artistId, new Date().toISOString().slice(0, 10), id]);
            return result.rows[0];
        } catch (error) {
            throw new Error(`Error updating song: ${error.message}`);
        }
    }

    async deleteSong(id) {
        const query = `
            DELETE FROM songs WHERE id = $1
            RETURNING *
        `;
        try {
            const result = await pool.query(query, [id]);
            return result.rows[0];
        } catch (error) {
            throw new Error(`Error deleting song: ${error.message}`);
        }
    }

    async addCategoryToSong(songId, categoryId) {
        const query = `
            INSERT INTO song_category (song_id, category_id)
            VALUES ($1, $2)
            RETURNING *
        `;
        try {
            const result = await pool.query(query, [songId, categoryId]);
            return result.rows[0];
        } catch (error) {
            throw new Error(`Error adding category to song: ${error.message}`);
        }
    }

    async findCategoriesIdByNames(categoryNames) {
        const query = `
            SELECT id FROM categories WHERE name = ANY($1)
        `;
        try {
            const result = await pool.query(query, [categoryNames]);
            return result.rows;
        } catch (error) {
            throw new Error(`Error finding categories by names: ${error.message}`);
        }
    }


    async findCategoriesBySongId(songId) {
        const query = `
            SELECT c.*
            FROM categories c
            JOIN song_category sc ON c.id = sc.category_id
            WHERE sc.song_id = $1
        `;
        try {
            const result = await pool.query(query, [songId]);
            return result.rows;
        } catch (error) {
            throw new Error(`Error finding categories by song id: ${error.message}`);
        }
    }

    async getCurrentSongMaxId() {
        const query = `
            SELECT MAX(id) FROM songs
        `;
        try {
            const result = await pool.query(query);
            return result.rows[0].max;
        } catch (error) {
            throw new Error(`Error getting current song id: ${error.message}`);
        }
    }
};

export default new songModel();
