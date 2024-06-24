const router = require("express").Router();
const productController = require("../Controller/productController");

router.post('/add',productController.AddProduct);
router.get('/get',productController.checkCartProduct);
router.post('/remove',productController.removeFromCart);
router.get('/get/all',productController.getCartProducts);

module.exports = router;