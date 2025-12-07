const db = require('./db');

class Product {
    static async create(productData) {
        const { title, preview_url, description, price_backend, price_standard, price_custom, zip_file_url } = productData;
        const [result] = await db.execute(
            'INSERT INTO products (title, preview_url, description, price_backend, price_standard, price_custom, zip_file_url) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [title, preview_url, description, price_backend, price_standard, price_custom, zip_file_url]
        );
        return result.insertId;
    }

    static async addImage(productId, imageUrl) {
        await db.execute('INSERT INTO product_images (product_id, image_url) VALUES (?, ?)', [productId, imageUrl]);
    }

    static async findAll() {
        // Basic fetch, images would ideally be joined or fetched separately
        const [rows] = await db.execute('SELECT * FROM products');
        for (let product of rows) {
            const [images] = await db.execute('SELECT image_url FROM product_images WHERE product_id = ?', [product.id]);
            product.images = images.map(img => img.image_url);
        }
        return rows;
    }

    static async findById(id) {
        const [rows] = await db.execute('SELECT * FROM products WHERE id = ?', [id]);
        if (rows.length === 0) return null;
        const product = rows[0];
        const [images] = await db.execute('SELECT image_url FROM product_images WHERE product_id = ?', [id]);
        product.images = images.map(img => img.image_url);
        return product;
    }
}

module.exports = Product;
