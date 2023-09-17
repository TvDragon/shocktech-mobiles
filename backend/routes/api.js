const express = require('express');
const router = express.Router();

const phonesController = require("../controllers/phones-controller");
const usersController = require("../controllers/users-controller");

router.get("/best-sellers", phonesController.getBestSellers);

router.get("/sold-out-soon", phonesController.getSoldOutSoon);

router.get('/search', phonesController.searchTitle);

router.get('/product', phonesController.getPhone);

router.post('/register', usersController.register);

module.exports = router;