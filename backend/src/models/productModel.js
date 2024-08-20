// backend/src/models/productModel.js
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    id: String,
    title: String,
    // Add other fields as per requirements
});

module.exports = mongoose.model('Product', productSchema);
