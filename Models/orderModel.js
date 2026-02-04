const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    customerName: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    items: [
        {
            productId: { type: mongoose.Schema.Types.ObjectId, ref: "products", required: true },
            name: { type: String },
            price: Number,
            quantity: {type: Number, default: 1}
        }
    ],
    totalAmount: { type: Number, required: true },
    status: {
        type: String,
        enum: ["pending", "Deliveried"],
        default: "pending"
    },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'Users', required: true }
}, { timestamps: true }
);

module.exports = mongoose.model('Orders', orderSchema);