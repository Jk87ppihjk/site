const Product = require('./productModel');

exports.createProduct = async (req, res) => {
    try {
        const { title, description, price_backend, price_standard, price_custom } = req.body;

        // Handle files
        const zipFile = req.files['zip'] ? req.files['zip'][0] : null;
        const imageFiles = req.files['images'] || [];

        if (!zipFile) {
            return res.status(400).json({ message: 'Zip file is required' });
        }
        if (imageFiles.length === 0) {
            return res.status(400).json({ message: 'At least one image is required' });
        }

        const preview_url = req.body.preview_url || ''; // Optional external preview link
        const zip_file_url = zipFile.path;

        const productId = await Product.create({
            title,
            preview_url,
            description,
            price_backend,
            price_standard,
            price_custom,
            zip_file_url
        });

        for (const file of imageFiles) {
            await Product.addImage(productId, file.path);
        }

        res.status(201).json({ message: 'Product created successfully', productId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.getAllProducts = async (req, res) => {
    try {
        const products = await Product.findAll();
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json(product);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
