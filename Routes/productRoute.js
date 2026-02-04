const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');

const {
    addProducts,
    getProduct,
    getAllProducts,
    updateProduct,
    delProduct
} = require('../Controllers/productCtrl');

router.post('/addproducts', upload.array('images', 5), addProducts);

router.get('/getproduct/:id', getProduct);
router.get('/getproducts', getAllProducts);

router.put('/updateproduct/:id', upload.array('images', 5), updateProduct);

router.delete('/deletepro/:id', delProduct);

module.exports = router;
