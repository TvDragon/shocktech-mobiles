const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Types.ObjectId;

// Crete Schema for Carts
const CartSchema = new Schema({
  userId: {
    type: String,
    default: ""
  },
  items: {
    type: Array,
    default: []
  }
}, { versionKey: false, strict: false });

CartSchema.statics.addToCart = async function(phoneUid, userId, quantity) {
  const addPhone = {phoneUid: phoneUid, quantity: quantity};

  try {
    const cart = await this.findOne({userId: userId});

    if (cart) {
      const existingPhone = cart.items.find(p => p.phoneUid === phoneUid);
      if (existingPhone) {
        // Increment the quantity for an existing phone
        await this.findOneAndUpdate(
          { userId: userId, "items.phoneUid": phoneUid },
          { $inc: { "items.$.quantity": quantity } }
        );
      } else {
        // Add phone to cart
        cart.items.push(addPhone);
        cart.save();
      }
    } else {
      // Create new cart object
      const newCart = new Cart(
        {userId: userId,
          items: [addPhone]}
      );
      newCart.save();
    }
    return true;
  } catch {
    return false;
  }
}

CartSchema.statics.getCartQuantity = async function(userId, phoneUid) {
  const cart = await this.findOne({userId: userId});

  if (cart) {
    const cartItem = cart.items.find(item => item.phoneUid === phoneUid);

    if (cartItem) {
      return {"quantity": cartItem.quantity};
    }
  }
  return {"quantity": 0};
}

CartSchema.statics.getCart = function(userId) {
  return this.findOne({userId: userId});
}

CartSchema.statics.removeFromCart = async function(userId, phoneUid) {
  await this.updateOne(
    {userId: userId},
    {$pull: {items: {phoneUid: phoneUid}}}
  );
}

CartSchema.statics.removeItemsFromCart = async function(userId) {
  await this.updateOne(
    {userId: userId},
    {$set: {items: []}}
  );
}

// Create model for Carts
const Cart = mongoose.model('Cart', CartSchema, "Carts");

module.exports = Cart;