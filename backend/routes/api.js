const express = require('express');
const router = express.Router();

const phonesController = require("../controllers/phones-controller");
const usersController = require("../controllers/users-controller");
const cartsController = require("../controllers/carts-controller");
const savesController = require("../controllers/saves-controller");
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

router.post('/addToSaveForLater', savesController.saveForLater);

router.post('/removeFromSaveForLater', savesController.removeFromSaveForLater);

router.get('/saveForLater', savesController.getSaveForLater);

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

router.post('/deleteListing', phonesController.deleteListing);

router.post('/addListing', phonesController.addListing);

router.post('/resetPassword', usersController.resetPassword);

router.post('/confirmResetPassword', usersController.confirmResetPassword);

module.exports = router;