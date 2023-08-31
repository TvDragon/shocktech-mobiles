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
    var results = await Phone.searchTitle(searchTitle);
    if (results.length == 0) {
      return res.json({error: "No phone title matches search."});
    }
    return res.json(results);
  }
  return res.json({error: "No query for search title."});
}