const db = require('./db');

class Chat {
    static async create(userId, productId, orderId, adminId = null) {
        const [result] = await db.execute(
            'INSERT INTO chats (user_id, order_id, admin_id) VALUES (?, ?, ?)',
            [userId, orderId, adminId]
        );
        return result.insertId;
    }

    static async findByOrderId(orderId) {
        const [rows] = await db.execute('SELECT * FROM chats WHERE order_id = ?', [orderId]);
        return rows[0];
    }

    static async findByUserId(userId) {
        const [rows] = await db.execute('SELECT * FROM chats WHERE user_id = ?', [userId]);
        return rows;
    }

    static async findAll() {
        // Admin view
        const [rows] = await db.execute('SELECT c.*, u.name as user_name FROM chats c JOIN users u ON c.user_id = u.id');
        return rows;
    }

    static async addMessage(chatId, senderId, message) {
        await db.execute(
            'INSERT INTO messages (chat_id, sender_id, message) VALUES (?, ?, ?)',
            [chatId, senderId, message]
        );
    }

    static async getMessages(chatId) {
        const [rows] = await db.execute(
            'SELECT * FROM messages WHERE chat_id = ? ORDER BY created_at ASC',
            [chatId]
        );
        return rows;
    }
}

module.exports = Chat;
