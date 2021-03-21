const productsConfig = require('../models/productsConfig');

exports.productList = (req, res) => {
    res.send(productsConfig);
}
