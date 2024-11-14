const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;
require('dotenv').config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    folder: 'products',
    allowedFormats: ['jpg', 'jpeg', 'png', 'webp'],
});

const upload = multer({ storage: storage });

module.exports = upload.fields([
    { name: 'images[0]', maxCount: 1 },
    { name: 'images[1]', maxCount: 1 },
    { name: 'images[2]', maxCount: 1 },
    { name: 'images[3]', maxCount: 1 },
]);
 