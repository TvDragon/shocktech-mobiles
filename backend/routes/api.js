const express = require('express');
const router = express.Router();

const phonesController = require("../controllers/phones-controller");

router.get('/sold-out-soon', phonesController.getSoldOutSoon);

router.get('/best-sellers', phonesController.getBestSellers);

router.get('/search', phonesController.searchTitle);

module.exports = router;