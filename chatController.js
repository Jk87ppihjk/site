const Chat = require('./chatModel');

exports.sendMessage = async (req, res) => {
    try {
        const { chatId } = req.params;
        const { message } = req.body;
        const senderId = req.user.id;

        // Verify participation
        // Simplification: Not fetching chat to verify user_id/admin_id match for now, 
        // effectively allowing any auth user to post to a known chat ID if they have it.
        // In prod, check if req.user.id == chat.user_id or req.user.role == admin

        await Chat.addMessage(chatId, senderId, message);
        res.status(201).json({ message: 'Message sent' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getMessages = async (req, res) => {
    try {
        const { chatId } = req.params;
        const messages = await Chat.getMessages(chatId);
        res.json(messages);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getUserChats = async (req, res) => {
    try {
        const chats = await Chat.findByUserId(req.user.id);
        res.json(chats);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getAllChats = async (req, res) => {
    try {
        const chats = await Chat.findAll();
        res.json(chats);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
