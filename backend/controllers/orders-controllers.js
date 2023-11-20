const Order = require("../models/orders");
const Cart = require("../models/carts");

min = 100000000000;
max = 1000000000000;

module.exports.checkout = async function(req, res) {
  const userId = req.body.userId;
  var orderId = Math.floor(Math.random() * (max - min) ) + min;
  var numIterations = 0;
  var maxIterations = max - min;
  while (await Order.getOrder(orderId)) {
    if (numIterations === maxIterations) {
      min *= 10;
      max *= 10;
      maxIterations = max - min;
      numIterations = 0;
    }
    orderId = Math.floor(Math.random() * (max - min) ) + min;
    numIterations += 1;
  }

  if (userId) {
    const cart = await Cart.getCart(userId);
    if (cart) {
      await Order.checkout(userId, cart.items, orderId);
      // need to reduce quantity from phone listing
      // need to remove items from shopping cart
      return res.json({success: "Ordered items"});
    }
    return res.json({error: "No items in cart to checkout"});
  }
  return res.json({error: "Invalid User Id"});
}