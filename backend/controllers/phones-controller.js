const phones = require("../model/phones");

module.exports.getSoldOutSoon = async function(req, res) {
  var results = await phones.getSoldOutSoon();
  if (results.length == 0) {
    return res.json({error: "Cannot get sold out soon."});
  }

  return res.json(results);
}

module.exports.getBestSellers = async function(req, res) {
  var results = await phones.getBestSellers();
  if (results.length == 0) {
    return res.json({error: "Cannot get best sellers."});
  }

  return res.json(results);
}

module.exports.searchTitle = async function(req, res) {

  if (req.query.searchTitle) {
    var title = req.query.searchTitle.toLowerCase();
    var results = await phones.searchTitle(title);
    if (results.length == 0) {
      return res.json({error: "Cannot find phone for search title"});
    }

    return res.json(results);
  }
}