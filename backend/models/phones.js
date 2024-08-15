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
  uid: {
    type: Number,
    default: 100000,
  },
  disabled: {
    type: Boolean,
    default: false,
  }
}, { versionKey: false, strict: false });

PhoneSchema.statics.getPhones = function() {
  return this.find({});
}

PhoneSchema.statics.getBrands = function() {
  return this.distinct('brand');
}

const convertReviewsToUsersPipline = [
  {
    $unwind: {
      path: "$reviews",
      preserveNullAndEmptyArrays: true // Unwind null and empty values(array)
    }
  },
  {
    $addFields: {
      "reviews.reviewerObj": {
        $toObjectId: "$reviews.reviewer" // Create new field named "reviews.reviewerOBj" containing "reviews.reviewer" as ObjectId
      }
    }
  },
  {
    $lookup: {
      from: "Users",
      localField: "reviews.reviewerObj",
      foreignField: "_id",
      as: "reviews.reviewerObj"
    }
  },
  {
    $group: {
      _id: "$_id",
      title: { $first: "$title" }, // Take the first value of field
      brand: { $first: "$brand" },
      image: { $first: "$image" },
      stock: { $first: "$stock" },
      price: { $first: "$price" },
      disabled: { $first: "$disabled" },
      uid: { $first: "$uid" },
      seller: {$first: "$seller"},
      condition: {$first: "$condition"},
      avgRatings: { $first: "$avgRatings" },
      reviews: { $push: "$reviews" } // Push all reviews back into an array
    }
  }
];

PhoneSchema.statics.getBestSellers = function() {
  return this.aggregate([
    {$match: {$and: [
      {disabled: false},
      {stock: {$gt: 0}},
      {"reviews.1": {$exists: true}}  // Array length reviews at least size 2
    ]}},
    {$sort: {avgRatings: -1}},
    {$limit: 5},
    ...convertReviewsToUsersPipline,
  ]);
}

PhoneSchema.statics.getSoldOutSoon = function() {
  return this.aggregate([
    {$match: {$and: [
      {stock: {$gt: 0}},
      {disabled: false}
    ]}},
    {$sort: {stock: 1}},
    {$limit: 5},
    ...convertReviewsToUsersPipline,
  ]);
}

PhoneSchema.statics.searchTitle = async function(searchTitle, brands, conditions, sortBy) {
  var results = null;
  var basePipeline = null;

  if (brands != undefined && conditions != undefined) {
    if (typeof brands == 'string') {
      brands = [brands];
    }

    if (typeof conditions === 'string') {
      conditions = [conditions];
    }
    
    basePipeline = [
      {$match: {$and: [
        {title: {$regex: searchTitle, $options: 'i'}},
        {brand: {$in: brands}},
        {condition: {$in: conditions}},
        {disabled: false},
        {stock: {$gt: 0}}
      ]}},
      ...convertReviewsToUsersPipline,
      {$group: {
        _id: null,
        phones: {$push: "$$ROOT"},
        minPrice: {$min: "$price"},
        maxPrice: {$max: "$price"},
      }}
    ];
  } else if (brands != undefined) {
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
      ...convertReviewsToUsersPipline,
      {$group: {
        _id: null,
        phones: {$push: "$$ROOT"},
        minPrice: {$min: "$price"},
        maxPrice: {$max: "$price"},
      }}
    ];
  } else if (conditions != undefined) {
    if (typeof conditions === 'string') {
      conditions = [conditions];
    }
    basePipeline = [
      {$match: {$and: [
        {title: {$regex: searchTitle, $options: 'i'}},
        {condition: {$in: conditions}},
        {disabled: false},
        {stock: {$gt: 0}}
      ]}},
      ...convertReviewsToUsersPipline,
      {$group: {
        _id: null,
        phones: {$push: "$$ROOT"},
        minPrice: {$min: "$price"},
        maxPrice: {$max: "$price"},
      }}
    ];
  } else {
    basePipeline = [
      {$match: {
        $and: [
          { title: { $regex: searchTitle, $options: 'i' } },
          { disabled: false },
          { stock: { $gt: 0 } }
        ]
      }},
      ...convertReviewsToUsersPipline,
      {$group: {
        _id: null,
        phones: { $push: "$$ROOT" },
        minPrice: { $min: "$price" },
        maxPrice: { $max: "$price" }
      }}
    ];
  }

  var sortByPipeline = {}

  switch (sortBy) {
    case "Price: Low - High":
      sortByPipeline = { price: 1 }
      break;
    case "Price: High - Low":
      sortByPipeline = { price: -1 };
      break;
    case "Polularity":
      sortByPipeline = { avgRatings: -1};
      break
    case "Relevancy":
    case undefined:
    default:
      // No sort operation for relevancy or if sortBy is undefined
      sortByPipeline = { stock: -1};
      break;
  }
  // Combine the base pipeline with the sort pipeline (if any)
  const finalPipeline = [...basePipeline, 
    {
      $addFields: {
        phones: {
          $sortArray: {
            input: "$phones",
            sortBy: sortByPipeline
          }
        }
      }
    }
  ];

  results = await this.aggregate(finalPipeline);

  var brands = await this.distinct('brand');
  const brandsLen = brands.length;
  for (var i = 0; i < brandsLen; i++) {
    brands[i] = [brands[i], false];
  }
  var conditions = await this.distinct('condition');
  const conditionsLen = conditions.length;
  for (var i = 0; i < conditionsLen; i++) {
    conditions[i] = [conditions[i], false];
  }
  
  if (!(results.length)) {
    return [];
  }

  return {phones: results[0]["phones"], brands: brands, conditions: conditions,
          minPrice: results[0]["minprice"], maxPrice: results[0]["maxPrice"]};
}

PhoneSchema.statics.getPhone = async function(uid) {
  return await this.aggregate([
    {$match: {$and: [
      {uid: uid}
    ]}},
    ...convertReviewsToUsersPipline,
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

PhoneSchema.statics.orderPhone = async function(phoneUid, quantity) {
  const phones = await this.aggregate([
    {$match: {uid: phoneUid}}
  ]);
  const phone = phones[0];
  var newQuantity = phone.stock - quantity;
  if (newQuantity < 1) {
    newQuantity = 0;
    await this.updateOne(
      {uid: phoneUid},
      {$set: {disabled: true}}
    );
  }
  await this.updateOne(
    {uid: phoneUid},
    {$set: {stock: newQuantity}}
  );
}

PhoneSchema.statics.updateListing = async function(phoneUid, title, brand, price, stock) {
  const imgPath = `/phone_default_images/${brand}.png`;
  await this.updateOne(
    {uid: phoneUid},
    {$set: {title: title, brand: brand, price: price, stock: stock, image: imgPath}}
  );
}

PhoneSchema.statics.deleteListing = async function(phoneUid) {
  await this.deleteOne({uid: phoneUid});
}

PhoneSchema.statics.addListing = async function(title, brand, stock, price, uid) {
  const imgPath = `/phone_default_images/${brand}.png`;
  const newListing = new Phone({
    title: title,
    brand: brand,
    stock: stock,
    price: price,
    image: imgPath,
    reviews: [],
    disabled: false,
    avgRatings: 0,
    uid: uid
  });
  newListing.save();
}

// Create model for Phones
const Phone = mongoose.model('Phone', PhoneSchema, "Phones");

module.exports = Phone;