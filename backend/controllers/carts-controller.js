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