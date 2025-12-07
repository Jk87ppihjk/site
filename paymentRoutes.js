const express = require('express');
const router = express.Router();
const paymentController = require('./paymentController');

// Route to simulate payment explicitly if needed manually
router.post('/process', async (req, res) => {
    const { amount, cardDetails } = req.body;
    const result = await paymentController.processPayment(amount, cardDetails);
    res.json(result);
});

module.exports = router;
