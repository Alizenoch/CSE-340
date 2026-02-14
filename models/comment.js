const pool = require("../database/"); //imports from PostgreSQL database connection

class Comment {
    static async create(account_id, inventory_id, content) {
        try {

        const result = await pool.query(
            "INSERT INTO comments (account_id, inventory_id, content) VALUES ($1, $2, $3) RETURNING *",
            [account_id, inventory_id, content]
        );
        return result.rows[0];
       } catch (error) {
         console.error("DB error in Comment.create:", error);
        throw error;
       }
    }

    static async findByItem(item_id) {
        try {
        const result = await pool.query(
            `SELECT c.id AS comment_id, c.content, c.account_id AS user_id, a.account_firstname, a.account_lastname
            FROM comments c
            JOIN account a ON c.account_id = a.account_id
            WHERE c.inventory_id = $1
            ORDER BY c.created_at DESC`,
            [item_id]
        );
        return result.rows;
       } catch (error) {
         console.error("DB error in Comment.findByItem:", error);
         throw error;
       }
    }    
     
    static async delete(commentId, accountId) {
        try {

        await pool.query(
            "DELETE FROM comments WHERE id = $1 AND account_id = $2",
            [commentId, accountId]
        );
        return result.rowCount > 0; // true if deleted
       } catch (error) {
         console.error("DB error in Comment.delete:", error);
         throw error;
       }
    }
}    

module.exports = Comment;