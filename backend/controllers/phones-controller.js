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

module.exports.comment = async function(req, res) {
  try {
    const phone = req.body.phone;
    const id = phone._id;
    const reviews = phone.reviews;
    const numReviews = reviews.length;
    var totalRatings = 0;
    reviews.forEach((review) => {
      totalRatings += review.rating;
    });

    const newAvgRatings = +((totalRatings + req.body.rating) / (numReviews + 1)).toFixed(2);
    const success = Phone.submitReview(id, newAvgRatings, req.body.userId, req.body.review, req.body.rating);

    if (success) {
      return res.json({success: "Review Accepted"});
    }
    return res.json({error: "Cannot submit review"});
  } catch (err) {
    return res.json({error: "Cannot make a comment"});
  }
}

module.exports.hideReview = async function(req, res) {
  try {
    const success = Phone.hideReview(req.body.uid, req.body.comment);
    if (success) {
      return res.json({success: "Successfully hid review"});
    }
    return res.json({error: "Cannot hide review"});
  } catch (err) {
    return res.json({error: "Error hide review"});
  }
}

module.exports.showReview = async function(req, res) {
  try {
    const success = Phone.showReview(req.body.uid, req.body.comment);
    if (success) {
      return res.json({success: "Show review"});
    }
    return res.json({error: "Cannot show review"});
  } catch (err) {
    return res.json({error: "Error show review"});
  }
}

module.exports.productReviews = async function(req, res) {
  try {
    const userId = req.query.userId;
    const results = await Phone.productReviews(userId);
    if (results.length === 0) {
      return res.json({msg: "No product reviews"});
    }
    return res.json({results: results});
  } catch (err) {
    return res.json({error: "Error get product reviews"});
  }
}