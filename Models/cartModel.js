const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'Users', required: true },
    items: [
        {
            productId: { type: mongoose.Schema.Types.ObjectId, ref: "Products", required: true },
            name: { type: String },
            price: Number,
            quantity: Number
        }
    ]
});

module.exports = mongoose.model('Cart', cartSchema);