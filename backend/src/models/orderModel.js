// backend/src/models/orderModel.js
const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    id: String,
    total_price_set: {
        shop_money: {
            amount: String,
            currency_code: String
        }
    },
    created_at: Date,
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Customer'
    },
    // Add other fields as per requirements
});

module.exports = mongoose.model('Order', orderSchema);
