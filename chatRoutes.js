const express = require('express');
const router = express.Router();
const chatController = require('./chatController');
const { verifyToken, isAdmin } = require('./authMiddleware');

router.use(verifyToken);

router.get('/my-chats', chatController.getUserChats);
router.get('/admin/all', isAdmin, chatController.getAllChats);

router.get('/:chatId/messages', chatController.getMessages);
router.post('/:chatId/messages', chatController.sendMessage);

module.exports = router;
