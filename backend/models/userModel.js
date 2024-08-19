import pool from '../configs/dbConfig.js';

class userModel {
    async createUser(name, hash, email, isArtist) {
        const query = `
            INSERT INTO users (name, password, email, is_artist, created_at)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *
            `;
        try {
            const result = await pool.query(query, [name, hash, email, isArtist, new Date().toISOString().slice(0,10)]);
            return result.rows[0];
        } catch (error) {
            throw error;
        }
    }

    async findUserById(id) {
        const query = `
        SELECT * FROM users WHERE id = $1
        `;
        try {
            const result = await pool.query(query, [id]);
            return result.rows[0];
        } catch (error) {
            throw new Error(`Error finding user by id: ${error.message}`);
        }
    }

    async findUserByEmail(email) {
        const query = `
        SELECT * FROM users WHERE email = $1
        `;
        try {
            const result = await pool.query(query, [email]);
            return result.rows[0];
        } catch (error) {
            throw new Error(`Error finding user by email: ${error.message}`);
        }
    }

    async updateUserPassword(email, hash) {
        const query = `
        UPDATE users SET password = $1 WHERE email = $2
        RETURNING *
        `;
        try {
            const result = await pool.query(query, [hash, email]);
            return result.rows[0];
        } catch (error) {
            throw new Error(`Error updating user password: ${error.message}`);
        }
    }

};

export default new userModel();