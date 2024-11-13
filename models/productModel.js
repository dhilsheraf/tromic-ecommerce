const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String, required: true },
    category: { type: ObjectId , ref: 'Category', required: true },
    primaryImage: { type: String, required: true },  // Path to the primary image
    additionalImages: [{ type: String }],  // Array of paths to additional images
    stock: { type: Number, default: 0 },
    isDeleted: { type: Boolean, default: false }, // Soft delete flag
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);

module.exports = Product;