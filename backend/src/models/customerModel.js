// backend/src/models/customerModel.js
const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
    id: String,
    created_at: Date,
    default_address: {
        city: String
    },
    // Add other fields as per requirements
});

module.exports = mongoose.model('Customer', customerSchema);
