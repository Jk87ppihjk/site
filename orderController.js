const { Order, Rental } = require('./orderModel');
const Product = require('./productModel');
const paymentController = require('./paymentController');
const Chat = require('./chatModel'); // Will implement next

exports.buyProduct = async (req, res) => {
    try {
        const { product_id, type, card_details } = req.body;
        const user_id = req.user.id;

        const product = await Product.findById(product_id);
        if (!product) return res.status(404).json({ message: 'Product not found' });

        let amount = 0;
        if (type === 'backend') amount = product.price_backend;
        else if (type === 'standard') amount = product.price_standard;
        else if (type === 'custom') amount = product.price_custom;
        else return res.status(400).json({ message: 'Invalid type' });

        // Process Payment
        const payment = await paymentController.processPayment(amount, card_details);
        if (!payment.success) return res.status(400).json({ message: 'Payment failed' });

        let downloadUrl = null;
        if (type !== 'custom') {
            downloadUrl = product.zip_file_url;
        }

        const orderId = await Order.create(
            user_id,
            product_id,
            type,
            amount,
            'completed',
            payment.transactionId,
            downloadUrl
        );

        if (type === 'custom') {
            // Create a chat session automatically
            const chatId = await Chat.create(user_id, product_id, orderId); // Assuming we can pass null for admin initially
            return res.status(201).json({
                message: 'Purchase successful. Please chat with admin for customization.',
                orderId,
                chatId
            });
        }

        res.status(201).json({
            message: 'Purchase successful',
            orderId,
            downloadUrl
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.rentProduct = async (req, res) => {
    try {
        const { product_id, frontend_type, db_host, db_name, db_user, db_pass, card_details } = req.body;
        const user_id = req.user.id;

        if (frontend_type !== 'standard' && frontend_type !== 'custom') {
            return res.status(400).json({ message: 'Invalid frontend type for rental' });
        }

        const payment = await paymentController.createSubscription(product_id, card_details);
        if (!payment.success) return res.status(400).json({ message: 'Subscription failed' });

        await Rental.create(
            user_id,
            product_id,
            frontend_type,
            db_host,
            db_name,
            db_user,
            db_pass,
            payment.subscriptionId
        );

        res.status(201).json({ message: 'Rental subscription active. Admin will configure your site.' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getAllRentals = async (req, res) => {
    try {
        const rentals = await Rental.findAllWithDetails();
        res.json(rentals);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
