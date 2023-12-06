const express = require("express");
const shop = require("../controllers/shop");
const isAuth = require("../middleware/isauth");

const router = express.Router();

router.get("/", shop.home_page);
router.get("/cart", isAuth, shop.GetCart);
router.post("/cart", isAuth, shop.PostCart);
router.get("/order", isAuth, shop.getOrder);
router.post("/order", isAuth, shop.postOrder);
router.post("/removeCartProduct", isAuth, shop.removeCartProduct);
router.post("/deleteproduct", isAuth, shop.deleteProduct);
router.get("/products/:productId", isAuth, shop.productDetails);
router.get("/add_product", isAuth, shop.addGetProduct);
router.post("/add_product", isAuth, shop.addPostProduct);

router.get("/editproduct/:productId", isAuth, shop.editGetProduct);
router.post("/editproduct/:productId", isAuth, shop.editPostProduct);

module.exports = router;
