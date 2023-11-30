const Phone = require('../models/phones');
const User = require("../models/users");

module.exports.getPhones = async function(req, res) {
  const userId = req.query.userId;
  if (userId) {
    const phones = await Phone.getPhones();
    if (phones.length == 0) {
      return res.json({error: "Error getting phones"});
    }
    return res.json({phones: phones});
  }
  return res.json({error: "Not valid user Id"});
}

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

module.exports.deleteReview = async function(req, res) {
  try {
    const phoneId = req.body.phoneId;
    const reviewerId = req.body.userId;
    await Phone.deleteReview(phoneId, reviewerId);

    return res.json({success: "Delete Review"});
  } catch (err) {
    return res.json({error: "Error deleting review"});
  }
}

module.exports.getBrands = async function(req, res) {
  try {
    const brands = await Phone.getBrands();

    if (brands.length === 0) {
      return res.json({error: "Couldn't get brands"});
    }

    return res.json({brands: brands});
  } catch (err) {
    return res.json({error: "Error getting brands"});
  }
}

module.exports.updateListing = async function(req, res) {
  try {
    const userId = req.body.userId;
    const uid = req.body.uid;
    const title = req.body.title;
    const brand = req.body.brand;
    const price = req.body.price;
    const stock = req.body.stock;
    const user = await User.findUserById(userId);
    if (user) {
      if (user.admin) {
        if (uid && title && brand && price && stock) {
          await Phone.updateListing(uid, title, brand, price, stock);
          return res.json({success: "Updated Listing"});
        }
        return res.json({error: "Missing data for a field"});
      }
      return res.json({error: "User does not have admin privileges"});
    } else {
      return res.json({error: "Not valid userId"});
    }
  } catch (err) {
    return res.json({error: "Error updating listing"});
  }
}

module.exports.deleteListing = async function(req, res) {
  try {
    const userId = req.body.userId;
    const uid = req.body.uid;
    const user = await User.findUserById(userId);

    if (user) {
      if (user.admin) {
        await Phone.deleteListing(uid);
        return res.json({success: "Deleted listing"});
      }
      return res.json({error: "User does not have admin privileges"});
    }
    return res.json({error: "Not valid userId"});
  } catch (err) {
    return res.json({error: "Error deleting listing"});
  }
}