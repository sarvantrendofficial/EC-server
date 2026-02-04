const express = require('express');
const router = express.Router();
const { addToCart, getCartByUser, removeFromCart } = require('../Controllers/cartCtrl');

router.get('/get-cart/:id', getCartByUser);
router.post('/addtocart', addToCart);
router.post('/remove', removeFromCart);

module.exports = router;