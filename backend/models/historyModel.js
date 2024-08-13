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
};


export default new historyModel();
