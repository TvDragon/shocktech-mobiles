const express = require('express');
const router = express.Router();

const phonesController = require("../controllers/phones-controller");
const usersController = require("../controllers/users-controller");
const cartsController = require("../controllers/carts-controller");
const ordersController = require("../controllers/orders-controllers");

router.get("/best-sellers", phonesController.getBestSellers);

router.get("/sold-out-soon", phonesController.getSoldOutSoon);

router.get('/search', phonesController.searchTitle);

router.get('/product', phonesController.getPhone);

router.post('/register', usersController.register);

router.post('/login', usersController.login);

router.post('/getUserFromToken', usersController.getUserFromToken);

router.post('/validateToken', usersController.validateToken);

router.post('/comment', phonesController.comment);

router.post('/hideReview', phonesController.hideReview);

router.post('/showReview', phonesController.showReview);

router.post('/addToCart', cartsController.addToCart);

router.post('/removeFromCart', cartsController.removeFromCart);

router.post('/saveProfile', usersController.saveProfile);

router.post('/changePassword', usersController.changePassword);

router.get('/productReviews', phonesController.productReviews);

router.post('/deleteReview', phonesController.deleteReview);

router.get('/cart', cartsController.getCart);

router.post('/checkout', ordersController.checkout);

router.get('/orders', ordersController.getOrders);

router.get('/phones', phonesController.getPhones);

router.get('/getBrands', phonesController.getBrands);

router.post('/updateListing', phonesController.updateListing);

module.exports = router;