const express = require('express');
const router = express.Router();
const productController = require('./productController');
const upload = require('./uploadMiddleware');
const { verifyToken, isAdmin } = require('./authMiddleware');

router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProductById);

// Create product: requires 'images' (max 5) and 'zip' (max 1)
router.post('/',
    verifyToken,
    isAdmin,
    upload.fields([{ name: 'images', maxCount: 5 }, { name: 'zip', maxCount: 1 }]),
    productController.createProduct
);

module.exports = router;
