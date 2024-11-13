const multer = require('multer');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

// Set storage configuration for multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = 'uploads/products/';
        fs.mkdirSync(uploadPath, { recursive: true });
        cb(null, uploadPath); // Ensure the 'uploads/products' directory exists
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Filename with timestamp to avoid collisions
    }
});

// Initialize multer with storage configuration, file size limit, and file filter for images
const upload = multer({
    storage,
    limits: { fileSize: 1024 * 1024 * 5 }, // 5MB limit per image
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true); // Allow only image files
        } else {
            cb(new Error('Only image files are allowed'), false);
        }
    }
}).array('images', 5); // Use .array to handle multiple images

// Image resizing middleware
const resizeImages = async (req, res, next) => {
    if (!req.files || req.files.length < 3) {
        return res.status(400).json({ error: "Please upload at least 3 images." });
    }

    req.body.primaryImage = null;  // Store the first image as primary
    req.body.additionalImages = [];  // Store remaining images as additional

    try {
        await Promise.all(
            req.files.map(async (file, index) => {
                const filename = `resized-${Date.now()}-${file.originalname}`;
                const filePath = path.resolve(file.destination, filename);
                
                // Resize and crop the images to ensure proper dimensions
                await sharp(file.path)
                    .resize(800, 800, { fit: 'cover' })  // Crop and resize to fit 800x800
                    .toFormat('jpeg')
                    .jpeg({ quality: 90 })
                    .toFile(filePath);  // Save the resized image

                const resizedImagePath = `/uploads/products/${filename}`;

                // Set the first image as the primary image
                if (index === 0) {
                    req.body.primaryImage = resizedImagePath;
                } else {
                    req.body.additionalImages.push(resizedImagePath);
                }
                
                // Remove original image after processing using async unlink
                fs.unlink(file.path, (err) => {
                    if (err) {
                        console.error(`Failed to delete original image: ${file.path}`, err);
                    }
                });
            })
        );
        next();  // Proceed to the next middleware or route handler
    } catch (error) {
        console.error("Error processing images:", error);
        res.status(500).json({ error: "Image processing failed" });
    }
};

module.exports = { upload, resizeImages };
