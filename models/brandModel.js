const mongoose = require('mongoose');

const brandSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    isActive: {
        type: Boolean,
        default: true, 
        required: true 
    }
},{
    timestamps:true
});

const Brand = mongoose.model('Brand', brandSchema);
module.exports = Brand;
