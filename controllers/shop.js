const productModel = require("../models/product");
const userModel = require("../models/user");
const orderModel = require("../models/order");
const mongoose = require("mongoose");

module.exports.GetCart = async (req, res, next) => {
  const userEntity = await userModel
    .findOne({ _id: req.session.user._id })
    .populate("cart.items.product");

  let productList = [];
  let totalAmount = 0;
  if (userEntity.cart.items.length == 0) {
    return res.render("cart", {
      products: [],
      total_amount: 0,
      cartLength: 0,
      isAuthenticated: req.session.isLoggedin,
    });
  }
  let total_qty = 0;
  console.log(userEntity);
  for (let i of userEntity.cart.items) {
    totalAmount += i.product.price * i.qty;
    total_qty += i.qty;
    productList.push({
      id: i.product._id,
      title: i.product.title,
      price: i.product.price,
      total_price: i.product.price * i.qty,
      description: i.product.description,
      qty: i.qty,
    });
  }

  return res.render("cart", {
    products: productList,
    total_amount: totalAmount,
    cartLength: total_qty,
    isAuthenticated: req.session.isLoggedin,
  });
};

exports.PostCart = async (req, res, next) => {
  const prodId = req.body.product_id;
  let found = false;
  console.log(req.session.user.cart);
  for (let item of req.session.user.cart.items) {
    console.log("item is", item, item.product.toString());
    if (item.product.toString() == prodId) {
      found = true;
      item.qty += 1;
    }
  }

  if (!found) {
    req.session.user.cart.items.push({
      product: new mongoose.Types.ObjectId(prodId),
      qty: 1,
    });
  }
  console.log(req.session.user.cart);
  await userModel.findByIdAndUpdate(
    req.session.user._id.toString(),
    req.session.user
  );
  console.log("update in the cart", req.session.user);
  return res.redirect("/cart");
};

exports.removeCartProduct = async (req, res, next) => {
  const prodId = req.body.product_id;
  const userEntity = req.session.user;
  const updateditem = userEntity.cart.items.filter(
    (item) => item.product._id.toString() != prodId
  );
  userEntity.cart.items = updateditem;
  await userModel.findByIdAndUpdate(req.session.user._id, userEntity);
  return res.redirect("/cart");
};

exports.productDetails = async (req, res, next) => {
  const productId = req.params.productId;
  const products = await productModel.findOne({ _id: productId }).exec();
  return res.render("shop", {
    products: [products],
    cartLength: 0,
    delete: true,
    isAuthenticated: req.session.isLoggedin,
  });
};

exports.deleteProduct = async (req, res, next) => {
  const prodId = req.body.product_id;
  await productModel.findByIdAndDelete({ _id: prodId });
  return res.redirect("/");
};
module.exports.home_page = (req, res, next) => {
  productModel
    .find()
    .then((products) => {
      if (products) {
        return res.render("shop", {
          products: products,
          cartLength: 0,
          isAuthenticated: req.session.isLoggedin,
        });
      }
    })
    .catch((err) => {
      if (err) {
        console.log("Some error occured while fetching data from DB", err);
        return redirect("/");
      }
    });
};

module.exports.addGetProduct = (req, res, next) => {
  return res.render("addproduct", {
    cartLength: 0,
    isAuthenticated: req.session.isLoggedin,
  });
};

exports.addPostProduct = (req, res, next) => {
  const product = new productModel({
    title: req.body.title,
    description: req.body.description,
    price: req.body.price,
    imageUrl: req.body.product_url,
    user: req.session.user,
  });
  product.save();
  return res.redirect("/");
};

exports.editGetProduct = async (req, res, next) => {
  const prodId = req.params.productId;
  const product = await productModel.findById(prodId).exec();
  return res.render("addproduct", {
    product: product,
    cartLength: 0,
    isAuthenticated: req.session.isLoggedin,
  });
};

exports.editPostProduct = async (req, res, next) => {
  const prodId = req.params.productId;
  const updatedProduct = {
    title: req.body.title,
    description: req.body.description,
    imageUrl: req.body.product_url,
    price: req.body.price,
  };
  await productModel.findByIdAndUpdate(prodId, updatedProduct);
  return res.redirect(`/products/${prodId}`);
};

exports.errorPage = (req, res, next) => {
  return res.send("<h1>This is a an error page.</h1>");
};

exports.getOrder = async (req, res, next) => {
  const orders = await orderModel.find({ user: req.session.user }).exec();
  return res.render("orders", {
    orders: orders,
    isAuthenticated: req.session.isLoggedin,
  });
};

exports.postOrder = async (req, res, next) => {
  const userEntity = await userModel
    .findById(req.session.user._id)
    .populate("cart.items.product");

  const cart = userEntity.cart.items;
  let total_amount = 0;
  let total_qty = 0;
  let productlist = [];

  if (cart.length == 0) {
    return res.redirect("/order");
  }

  for (let item of cart) {
    console.log(item.product);
    productlist.push(item.product._id);
    total_amount += item.product.price * item.qty;
    total_qty += item.qty;
  }
  const order = new orderModel({
    product: productlist,
    orderTotal: total_amount,
    orderQty: total_qty,
    user: req.session.user._id,
  });

  order.save();

  req.session.user.cart.items = [];
  await userModel.findByIdAndUpdate(req.session.user._id, req.session.user);
  return res.render("orderdetail", {
    items: cart,
    order_id: order._id,
    isAuthenticated: req.session.isLoggedin,
  });
};
