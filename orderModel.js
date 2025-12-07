const db = require('./db');

class Order {
    static async create(userId, productId, type, amount, status = 'pending', transactionId = null, downloadUrl = null) {
        const [result] = await db.execute(
            'INSERT INTO orders (user_id, product_id, type, amount, status, transaction_id, download_url) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [userId, productId, type, amount, status, transactionId, downloadUrl]
        );
        return result.insertId;
    }

    static async findById(id) {
        const [rows] = await db.execute('SELECT * FROM orders WHERE id = ?', [id]);
        return rows[0];
    }

    static async findByUserId(userId) {
        const sql = `
            SELECT o.*, p.title as product_title, p.zip_file_url 
            FROM orders o 
            JOIN products p ON o.product_id = p.id
            WHERE o.user_id = ?
            ORDER BY o.created_at DESC
        `;
        const [rows] = await db.execute(sql, [userId]);
        return rows;
    }
}

class Rental {
    static async create(userId, productId, frontendType, userDbHost, userDbName, userDbUser, userDbPass, subscriptionId) {
        const [result] = await db.execute(
            'INSERT INTO rentals (user_id, product_id, frontend_type, user_db_host, user_db_name, user_db_user, user_db_pass, subscription_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [userId, productId, frontendType, userDbHost, userDbName, userDbUser, userDbPass, subscriptionId]
        );
        return result.insertId;
    }

    static async findByUserId(userId) {
        const sql = `
            SELECT r.*, p.title as product_title 
            FROM rentals r 
            JOIN products p ON r.product_id = p.id
            WHERE r.user_id = ?
            ORDER BY r.created_at DESC
        `;
        const [rows] = await db.execute(sql, [userId]);
        return rows;
    }

    static async findAllWithDetails() {
        const sql = `
            SELECT r.*, u.name as user_name, u.email as user_email, p.title as product_title 
            FROM rentals r 
            JOIN users u ON r.user_id = u.id 
            JOIN products p ON r.product_id = p.id
        `;
        const [rows] = await db.execute(sql);
        return rows;
    }
}

module.exports = { Order, Rental };
