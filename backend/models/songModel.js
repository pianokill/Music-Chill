// songModel.js
import pool from '../configs/dbConfig.js';
import axios from 'axios';

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

    async getSongsRecommendation(user_id) {
        try {
            const result = await axios.get(`http://localhost:8000/predict/${user_id}/10`);
            console.log(result.data)
            return result.data;
        } catch (error) {
                throw new Error(`Error getting recommendations ${error.message}`);;
          }
    }
};

export default new songModel();
