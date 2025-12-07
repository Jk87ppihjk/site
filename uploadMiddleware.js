const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('./cloudinaryConfig');

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (req, file) => {
        if (file.mimetype === 'application/zip' || file.mimetype === 'application/x-zip-compressed') {
            return {
                folder: 'graviti_zips',
                resource_type: 'raw',
                public_id: file.originalname.split('.')[0] + '_' + Date.now()
            };
        } else {
            return {
                folder: 'graviti_products',
                resource_type: 'image',
                allowed_formats: ['jpg', 'png']
            };
        }
    }
});

const upload = multer({ storage: storage });

module.exports = upload;
