const Cart = require("../models/carts");
const Save = require("../models/saves");

module.exports.saveForLater = async function(req, res) {
  if (req.body.uid) {
    const uid = Number(req.body.uid);
    const quantity = Number(req.body.quantity);
    const success = await Save.saveForLater(uid, req.body.userId, quantity);

    if (success) {
      return res.json({success: "Save item for later"});
    }
    return res.json({error: "Failed to save item for later"});
  }
  return res.json({error: "Not valid Phone UID"});
}

module.exports.getSaveForLater = async function(req, res) {
  const userId = req.query.userId;
  if (userId) {
    const save = await Save.getSaveForLater(userId);

    if (save) {
      return res.json({save: save});
    }
    return res.json({error: "No items in save for later"});
  }
  return res.json({error: "Not valid userId"});
}

module.exports.removeFromSaveForLater = async function(req, res) {
  const userId = req.body.userId;
  const phoneUid = req.body.phoneUid;
  if (userId && phoneUid) {
    try {
      await Save.removeFromSaveForLater(userId, phoneUid);
      return res.json({success: "Deleted item from save for later"});
    } catch (err) {
      return res.json({error: err});
    }
  }
  return res.json({error: "Not valid User Id or Phone Uid"});
}