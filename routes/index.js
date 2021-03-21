// Index serves main data to the view 
const express = require('express');
let router = express.Router();
const productController = require('../controllers/productsController');

router.get('/', (req, res) => {
    const data = {
        products: productController.productList
    }
    console.log(data);
    res.render('dashboard', data);
});

module.exports = router;