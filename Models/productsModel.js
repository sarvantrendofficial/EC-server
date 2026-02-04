const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    mrp: { type: Number, required: true },
    discount: { type: Number, required: true },
    price: { type: Number, required: true },
    category: { type: String, required: true },
    images: { type: [String], required: true },
    isActive: { type: Boolean, default: true, required: true }
})

module.exports = mongoose.model('Products', productSchema);