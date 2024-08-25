import pool from '../configs/dbConfig.js';

class playlistModel {
    async createPlaylist(name, is_public, create_by) {
        const query = `
            INSERT INTO playlists(name, is_public, created_by, updated_at)
            VALUES ($1, $2, $3, $4)
            RETURNING *;
        `;
        try {
            const result = await pool.query(query, [name, is_public, create_by, new Date().toISOString().slice(0,10)]);
            return result.rows[0];
        } catch (error) {
            throw new Error(`Error creating playlist: ${error.message}`);
        }
    }

    async getAllUserPlaylist(user_id) {
        const query = `
            SELECT * FROM playlists
            WHERE created_by = $1;
        `;
        try {
            const result = await pool.query(query, [user_id]);
            return result.rows;
        } catch (error) {
            throw new Error(`Error getting user playlist: ${error.message}`);
        }
    }

    async addSongToPlaylist(playlist_id, song_id) {
        const query = `
            INSERT INTO playlist_song(playlist_id, song_id)
            VALUES ($1, $2);
        `;
        try {
            await pool.query(query, [playlist_id, song_id]);
        } catch (error) {
            throw new Error(`Error adding song to playlist: ${error.message}`);
        }
    }

    async getPlaylistSongs(playlist_id) {
        const query = `
            SELECT s.id, s.name, u.name AS artist
            FROM songs s
            JOIN users u ON s.artist_id = u.id
            JOIN playlist_song ps ON s.id = ps.song_id
            WHERE ps.playlist_id = $1
        `;
        try {
            const result = await pool.query(query, [playlist_id]);
            return result.rows;
        } catch (error) {
            throw new Error(`Error getting playlist songs: ${error.message}`);
        }
    }

}

export default new playlistModel();