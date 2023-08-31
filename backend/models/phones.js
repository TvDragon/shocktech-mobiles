const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Types.ObjectId;

// Crete Schema for Phones
const PhoneSchema = new Schema({
  title: {
    type: String,
    default: "Title",
  },
  brand: {
    type: String,
    default: "Brand",
  },
  image: {
    type: String,
    default: "Imageurl",
  },
  stock: {
    type: Number,
    default: 1,
  },
  price: {
    type: Number,
    default: 100.00,
  },
  reviews: {
    type: Array,
    default: [],
  },
  avgRatings: {
    type: Number,
    default: 5.00,
  },
  numReviews: {
    type: Number,
    default: 100000,
  },
  disabled: {
    type: Boolean,
    default: false,
  }
}, { versionKey: false, strict: false });

PhoneSchema.statics.getBestSellers = function() {
  return this.aggregate([
    {$match: {$and: [
      {disabled: false},
      {stock: {$gt: 0}},
      {numReviews: {$gt: 1}}
    ]}},
    {$sort: {avgRatings: -1}},
    {$limit: 5}
  ]);
}

PhoneSchema.statics.getSoldOutSoon = function() {
  return this.aggregate([
    {$match: {$and: [
      {stock: {$gt: 0}},
      {disabled: false}
    ]}},
    {$sort: {stock: 1}},
    {$limit: 5}
  ]);
}

PhoneSchema.statics.searchTitle = async function(searchTitle, brands) {
  var results = null;
  if (brands == undefined) { 
    results = await this.aggregate([
      {$match: {$and: [
        {title: {$regex: searchTitle, $options: 'i'}},
        {disabled: false},
        {stock: {$gt: 0}}
      ]}}
    ])
  } else {
    if (typeof brands === 'string') {
      brands = [brands];
    }
    results = await this.aggregate([
      {$match: {$and: [
        {title: {$regex: searchTitle, $options: 'i'}},
        {brand: {$in: brands}},
        {disabled: false},
        {stock: {$gt: 0}}
      ]}}
    ])
  }

  var brands = await this.distinct('brand');
  const brandsLen = brands.length;
  for (var i = 0; i < brandsLen; i++) {
    brands[i] = [brands[i], false];
  }
  
  if (!(results.length)) {
    return [];
  }

  return {phones: results, brands: brands};
}

// Create model for Phones
const Phone = mongoose.model('Phone', PhoneSchema, "Phones");

module.exports = Phone;