const mongoose = require('mongoose');

const userProSchema = new mongoose.Schema({
    phone: { type: Number, required: true },
    address: { type: String, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'Users', required: true }
});

module.exports = mongoose.model('UserPro', userProSchema);