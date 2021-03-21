// API routes setup
const express = require('express');
let router = express.Router();
const productController = require('../controllers/productsController');

// List all products 
router.get('/', productController.productList);

module.exports = router;