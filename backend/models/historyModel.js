import pool from '../configs/dbConfig.js';

class historyModel {
    async getHistoryArtist(artist_id) {
        const query = `
            SELECT s.name, 
                COALESCE(SUM(h.listening_times), 0)/60.0 AS total_listening_times, 
                COALESCE(SUM(CASE WHEN h.liked THEN 1 ELSE 0 END), 0) AS total_likes
            FROM songs s
            LEFT JOIN user_history h ON h.song_id = s.id
            WHERE s.artist_id = $1
            GROUP BY s.id, s.name;
        `;
        try {
            const result = await pool.query(query, [artist_id]);
            return result.rows;
        } catch (error) {
            throw new Error(`Error getting history songs of an artist: ${error.message}`);
        }
    }

    async getUserLikedSongs(user_id) {
        const query = `
            SELECT song_id as id
            FROM user_history
            WHERE user_id = $1 AND liked = TRUE;
        `;
        try {
            const result = await pool.query(query, [user_id]);
            return result.rows;
        } catch (error) {
            throw new Error(`Error getting history liked songs of a user: ${error.message}`);
        }
    }

    async updateLikeSong(user_id, song_id, liked) {
        const query = `
            INSERT INTO user_history(user_id, song_id, listening_times, liked)
            VALUES ($1, $2, 0, $3)
            ON CONFLICT (user_id, song_id) DO UPDATE
            SET liked = $3;
        `;
        try {
            await pool.query(query, [user_id, song_id, liked]);
        } catch (error) {
            throw new Error(`Error updating like song: ${error.message}`);
        }
    }

    async updateListeningTimes(user_id, song_id, times) {
        const query = `
            INSERT INTO user_history(user_id, song_id, listening_times, liked)
            VALUES ($1, $2, $3, FALSE)
            ON CONFLICT (user_id, song_id) DO UPDATE
            SET listening_times = user_history.listening_times + $3;
        `;
        try {
            await pool.query(query, [user_id, song_id, times]);
        } catch (error) {
            throw new Error(`Error updating listening times: ${error.message}`);
        }
    }

};


export default new historyModel();
