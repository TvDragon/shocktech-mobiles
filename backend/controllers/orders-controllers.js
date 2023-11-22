const Order = require("../models/orders");
const Cart = require("../models/carts");
const Phone = require("../models/phones");

min = 100000000000;
max = 1000000000000;

module.exports.checkout = async function(req, res) {
  const userId = req.body.userId;
  const totalCost = req.body.total;
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
    if (totalCost) {

      const cart = await Cart.getCart(userId);
      if (cart) {
        await Order.checkout(userId, cart.items, orderId, totalCost);
        // Reduce quantity from phone listing
        const items = cart.items;
        const len = items.length;
        for (let i = 0; i < len; i++) {
          const item = items[i];
          await Phone.orderPhone(item.phoneUid, item.quantity);
        }
        // Remove items from shopping cart
        await Cart.removeItemsFromCart(userId);
        return res.json({success: "Ordered items"});
      }
      return res.json({error: "No items in cart to checkout"});
    }
    return res.json({error: "Total cost wasn't calculated"});
  }
  return res.json({error: "Invalid User Id"});
}

module.exports.getOrders = async function(req, res) {
  const userId = req.query.userId;
  if (userId) {
    const orders = await Order.getOrders(userId);
    if (orders) {
      return res.json({orders: orders.orders});
    }
    return res.json({orders: []});
  }
  return res.json({error: "Invalid User Id"});
}