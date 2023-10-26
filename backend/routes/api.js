const express = require('express');
const router = express.Router();

const phonesController = require("../controllers/phones-controller");
const usersController = require("../controllers/users-controller");

router.get("/best-sellers", phonesController.getBestSellers);

router.get("/sold-out-soon", phonesController.getSoldOutSoon);

router.get('/search', phonesController.searchTitle);

router.get('/product', phonesController.getPhone);

router.post('/register', usersController.register);

router.post('/login', usersController.login);

router.post('/getUserFromToken', usersController.getUserFromToken);

router.post('/validateToken', usersController.validateToken);

module.exports = router;