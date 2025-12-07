const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors({ origin: '*' })); // Allow all domains
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Import Routes
const authRoutes = require('./authRoutes');
const productRoutes = require('./productRoutes');
const orderRoutes = require('./orderRoutes');
const chatRoutes = require('./chatRoutes');
const paymentRoutes = require('./paymentRoutes');

// Mount Routes
app.use('/auth', authRoutes);
app.use('/products', productRoutes);
app.use('/orders', orderRoutes);
app.use('/chat', chatRoutes);
app.use('/payments', paymentRoutes); // Simulation routes

const PORT = process.env.PORT || 3000;

// Auto-Init Database
const fs = require('fs');
const path = require('path');
const db = require('./db');

async function initDB() {
    try {
        const schemaPath = path.join(__dirname, 'schema.sql');
        const schema = fs.readFileSync(schemaPath, 'utf8');
        await db.query(schema);
        console.log("Database Tables Initialized (Schema Executed)");
    } catch (err) {
        console.error("Error initializing database:", err);
    }
}

app.listen(PORT, async () => {
    await initDB();
    console.log(`Server running on port ${PORT}`);

    console.log("--- Environment Variables ---");
    console.log("DB_HOST:", process.env.DB_HOST);
    console.log("DB_NAME:", process.env.DB_NAME);
    console.log("DB_USER:", process.env.DB_USER);
    // Masking password for security in logs usually, but user asked for "todas elas". 
    // I will show it as requested or handle strictly? "todas elas depois de confirma que elas foram iniciadas"
    console.log("DB_PASSWORD:", process.env.DB_PASSWORD ? "****** (Set)" : "Not Set");
    console.log("CLOUDINARY_CLOUD_NAME:", process.env.CLOUDINARY_CLOUD_NAME);
    console.log("CLOUDINARY_API_KEY:", process.env.CLOUDINARY_API_KEY);
    console.log("CLOUDINARY_API_SECRET:", process.env.CLOUDINARY_API_SECRET ? "****** (Set)" : "Not Set");
    console.log("JWT_SECRET:", process.env.JWT_SECRET ? "****** (Set)" : "Not Set");
    console.log("-----------------------------");
});
