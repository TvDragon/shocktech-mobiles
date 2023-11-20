const Cart = require("../models/carts");
const Phone = require("../models/phones");

module.exports.addToCart = async function(req, res) {
  if (req.body.uid) {
    const uid = Number(req.body.uid);
    const cartQuantity = await Cart.getCartQuantity(req.body.userId, uid);
    if (cartQuantity) {
      const quantity = Number(req.body.quantity);
      const phone = await Phone.getPhone(uid);
      if (phone[0].stock >= (cartQuantity["quantity"] + quantity)) {
        const success = await Cart.addToCart(uid, req.body.userId, quantity);
    
        if (success) {
          return res.json({success: "Added item to cart"});
        }
      } else {
        return res.json({error: "Cannot add more than available stock"});
      }
    }
    return res.json({error: "Failed to add item to cart"});
  }
  return res.json({error: "Not valid Phone UID"});
}

module.exports.getCart = async function(req, res) {
  const userId = req.query.userId;
  if (userId) {
    const cart = await Cart.getCart(userId);

    if (cart) {
      return res.json({cart: cart});
    }
    return res.json({error: "No items in cart"});
  }
  return res.json({error: "Not valid userId"});
}

module.exports.removeFromCart = async function(req, res) {
  const userId = req.body.userId;
  const phoneUid = req.body.phoneUid;
  if (userId && phoneUid) {
    try {
      await Cart.removeFromCart(userId, phoneUid);
      return res.json({success: "Deleted item from cart"});
    } catch (err) {
      return res.json({error: err});
    }
  }
  return res.json({error: "Not valid User Id or Phone Uid"});
}