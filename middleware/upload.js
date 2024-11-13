const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary'); // Correct import
const cloudinary = require('cloudinary').v2;
require('dotenv').config();


// Configure Cloudinary with credentials
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configure Cloudinary storage for Multer
const storage = new CloudinaryStorage({  // Correct usage here
    cloudinary: cloudinary,
    folder: 'products',  // Cloudinary folder to store the images
    allowedFormats: ['jpg', 'jpeg', 'png','webp'],  // Only these formats are allowed
});

// Initialize multer with the Cloudinary storage
const upload = multer({ storage: storage });

module.exports = upload;
