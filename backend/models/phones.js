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
      {"reviews.1": {$exists: true}}  // Array length reviews at least size 2
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

PhoneSchema.statics.searchTitle = async function(searchTitle, brands, sortBy) {
  var results = null;
  var basePipeline = null;
  if (brands == undefined) {
    basePipeline = [
      {$match: {
        $and: [
          { title: { $regex: searchTitle, $options: 'i' } },
          { disabled: false },
          { stock: { $gt: 0 } }
        ]
      }},
      {$group: {
        _id: null,
        phones: { $push: "$$ROOT" },
        minPrice: { $min: "$price" },
        maxPrice: { $max: "$price" }
      }}
    ];
  } else {
    if (typeof brands === 'string') {
      brands = [brands];
    }

    basePipeline = [
      {$match: {$and: [
        {title: {$regex: searchTitle, $options: 'i'}},
        {brand: {$in: brands}},
        {disabled: false},
        {stock: {$gt: 0}}
      ]}},
      {$group: {
        _id: null,
        phones: {$push: "$$ROOT"},
        minPrice: {$min: "$price"},
        maxPrice: {$max: "$price"},
      }}
    ];
  }

  var sortPipeline = [];

  switch (sortBy) {
    case "Price: Low - High":
      sortPipeline = [{ $sort: { price: 1 } }];
      break;
    case "Price: High - Low":
      sortPipeline = [{ $sort: { price: -1 } }];
      break;
    case "Popularity":
      sortPipeline = [{ $sort: { avgRatings: -1}}];
      break;
    case "Relevancy":
    case undefined:
    default:
      // No sort operation for relevancy or if sortBy is undefined
      break;
  }

  // Combine the base pipeline with the sort pipeline (if any)
  const finalPipeline = [...sortPipeline, ...basePipeline];

  results = await this.aggregate(finalPipeline);

  var brands = await this.distinct('brand');
  const brandsLen = brands.length;
  for (var i = 0; i < brandsLen; i++) {
    brands[i] = [brands[i], false];
  }
  
  if (!(results.length)) {
    return [];
  }
  
  return {phones: results[0]["phones"], brands: brands,
          minPrice: results[0]["minprice"], maxPrice: results[0]["maxPrice"]};
}

PhoneSchema.statics.getPhone = async function(uid) {
  return await this.aggregate([
    {$match: {$and: [
      {uid: uid}
    ]}},
    {$unwind: {
      path: "$reviews",
      preserveNullAndEmptyArrays: true  // Unwind null and empty values(array)
    }},
    {$addFields: {
      "reviews.reviewerObj": {
        $toObjectId: "$reviews.reviewer", // Create new field named "reviews.reviewerOBj" containing "reviews.reviewer" as ObjectId
      }
    }},
    {$lookup: {
      from: "Users",
      localField: "reviews.reviewerObj",
      foreignField: "_id",
      as: "reviews.reviewerObj"
    }},
    {$group: {
      _id: "$_id",
      title: { $first: "$title" },  // Take the first value of field
      brand: { $first: "$brand" },
      image: { $first: "$image" },
      stock: { $first: "$stock" },
      price: { $first: "$price"},
      disabled: { $first: "$disabled"},
      uid: { $first: "$uid"},
      avgRatings: { $first: "$avgRatings"},
      reviews: { $push: "$reviews" } // Push all reviews back into an array
    }}
  ])
}

PhoneSchema.statics.submitReview = async function(phoneId, newAvgRatings, userId, comment, rating) {

  const newReview = {reviewer: userId, rating: rating, comment: comment};
  const options = { upsert: true, new: true };  // upsert if the object doesn't exist, and return the updated object

  // need to get phone data and update it
  try {
    await this.findOneAndUpdate(
      {_id: phoneId}, // filter to find object
      {$push: {reviews: newReview},
        $set: {avgRatings: newAvgRatings}},  // update object by pushing new review into array reviews
      options
    );
    return true;
  } catch {
    return false;
  }
}

PhoneSchema.statics.hideReview = async function(id, comment) {
  try {
    await this.findOneAndUpdate(
      {
        uid: id,
        'reviews.comment': comment
      },
      {$set: {'reviews.$.hidden': ""}}
    );
  } catch {
    return false;
  }
}

PhoneSchema.statics.showReview = async function(id, comment) {
  try {
    await this.findOneAndUpdate(
      {
        uid: id,
        'reviews.comment': comment
      },
      {$set: {'reviews.$.hidden': false}}
    );
  } catch {
    return false;
  }
}

PhoneSchema.statics.productReviews = function(userId) {
  return this.aggregate([
    {$match: {$and: [
      {'reviews.reviewer': userId}
    ]}}
  ]);
}

PhoneSchema.statics.deleteReview = async function(phoneId, reviewerId) {
 await this.updateOne(
  {_id: phoneId},
  {$pull: {reviews: {reviewer: reviewerId}}}
 );
}

// Create model for Phones
const Phone = mongoose.model('Phone', PhoneSchema, "Phones");

module.exports = Phone;