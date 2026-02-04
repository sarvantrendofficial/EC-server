const express = require('express');
const router = express.Router();
const { createOrder, getAllorders, updateOrders, getMyOrders } = require('../Controllers/orderCtrl');

router.get('/orders', getAllorders);
router.get('/myorders/:id', getMyOrders);

router.post('/createorder', createOrder);

router.put('/updateorder/:id', updateOrders);

module.exports = router;