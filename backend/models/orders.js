const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OrderSchema = new Schema({
  userId: {
    type: String,
    default: ""
  },
  orders: {
    type: Array,
    default: []
  }
}, {versionKey: false, strict: false});

OrderSchema.statics.getOrder = async function(orderId) {
  return await this.findOne({"orders.$.orderId": orderId});
}

OrderSchema.statics.checkout = async function(userId, items, orderId, totalCost) {
  const orders = await this.findOne({userId: userId});
  const order = {items: items, orderId: orderId, totalCost: totalCost};

  if (orders) {
    orders.orders.push(order);
    orders.save();
  } else {
    const newOrders = new Order({
      userId: userId,
      orders: order
    });
    newOrders.save();
  }
}

OrderSchema.statics.getOrders = async function(userId) {
  return await this.findOne({userId: userId});
}

const Order = mongoose.model('Order', OrderSchema, "Orders");

module.exports = Order;