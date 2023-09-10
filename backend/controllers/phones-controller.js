const Phone = require('../models/phones');

module.exports.getBestSellers = async function(req, res) {
  var results = await Phone.getBestSellers();
  if (results.length == 0) {
    return res.json({error: "Cannot get best sellers."});
  }
  return res.json(results);
}

module.exports.getSoldOutSoon = async function(req, res) {
  var results = await Phone.getSoldOutSoon();
  if (results.length == 0) {
    return res.json({error: "Cannot get sold out soon."});
  }
  return res.json(results);
}

module.exports.searchTitle = async function(req, res) {
  if (req.query.searchTitle) {
    var searchTitle = req.query.searchTitle;
    var brands = req.query.brand;
    var sortBy = req.query.sortBy;
    var results = await Phone.searchTitle(searchTitle, brands, sortBy);
    if (results.length == 0) {
      return res.json({error: "No phone title matches search."});
    }
    return res.json(results);
  }
  return res.json({error: "No query for search title."});
}

module.exports.getPhone = async function(req, res) {
  if (req.query.uid) {
    const uid = Number(req.query.uid);
    var results = await Phone.getPhone(uid);
    if (results.length == 0) {
      return res.json({error: "Cannot get product information."});
    }
    return res.json(results[0]);
  }
  return res.json({error: "No query for uid."});
}