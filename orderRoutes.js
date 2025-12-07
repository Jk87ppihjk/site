const express = require('express');
const router = express.Router();
const orderController = require('./orderController');
const { verifyToken, isAdmin } = require('./authMiddleware');

router.post('/buy', verifyToken, orderController.buyProduct);
router.post('/rent', verifyToken, orderController.rentProduct);

router.get('/my-orders', verifyToken, orderController.getUserOrders);
router.get('/my-rentals', verifyToken, orderController.getUserRentals);

// Admin view rentals
router.get('/rentals', verifyToken, isAdmin, orderController.getAllRentals);

module.exports = router;
