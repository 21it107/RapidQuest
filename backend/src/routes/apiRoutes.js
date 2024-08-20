// backend/src/routes/apiRoutes.js
const express = require('express');
const router = express.Router();
const ordersController = require('../controllers/ordersController');
const customersController = require('../controllers/customersController');
const productsController = require('../controllers/productsController');

// Define routes
router.get('/sales-over-time', ordersController.getTotalSalesOverTime);
router.get('/new-customers-over-time', customersController.getNewCustomersOverTime);
router.get('/products', productsController.getAllProducts);
router.get('/products/:id', productsController.getProductById);
router.post('/products', productsController.createProduct);
router.put('/products/:id', productsController.updateProduct);
router.delete('/products/:id', productsController.deleteProduct);

module.exports = router;