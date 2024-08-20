const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema for Save For Later
const SaveForLaterSchema = new Schema({
  userId: {
    type: String,
    default: ""
  },
  items: {
    type: Array,
    default: []
  }
}, { versionKey: false, strict: false });

SaveForLaterSchema.statics.saveForLater = async function(phoneUid, userId, quantity) {
  const addPhone = {phoneUid: phoneUid, quantity: quantity};

  try {
    const save = await this.findOne({userId: userId});

    if (save) {
      save.items.push(addPhone);
      save.save();
    } else {
      // Create new save for later object 
      const newSave = new SaveForLater(
        {userId: userId,
          items: [addPhone]}
      );
      newSave.save();
    }
    return true;
  } catch {
    return false;
  }
}

SaveForLaterSchema.statics.getSaveForLater = function(userId) {
  return this.findOne({userId: userId});
}

SaveForLaterSchema.statics.removeFromSaveForLater = async function(userId, phoneUid) {
  await this.updateOne(
    {userId: userId},
    {$pull: {items: {phoneUid: phoneUid}}}
  );
}

// Create model for Save for Later
const SaveForLater = mongoose.model('SaveForLater', SaveForLaterSchema, "SaveForLater");

module.exports = SaveForLater;