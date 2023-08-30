const FileSystem = require("fs");
let json = require('./phonelisting_demo.json');

const phoneListings = json["Phones"];
const min = 100000;
const max = 1000000;

var uids = new Set();

let length = phoneListings.length;

for (let i = 0; i < length; i++) {
  var phoneListing = phoneListings[i];
  delete phoneListing.seller;
  const numReviews = phoneListing.reviews.length;
  var avgRatings = 0;

  const reviews = phoneListing.reviews;
  for (const review of reviews) {
    avgRatings += (review.rating / numReviews);
  }
  phoneListing["avgRatings"] = +(avgRatings.toFixed(2));
  phoneListing["numReviews"] = numReviews;
  var uid = Math.floor(Math.random() * (max - min) + min + 1);
  while (uid in uids) {
    uid = Math.floor(Math.random() * (max - min) + min + 1);
  }
  uids.add(uid);
  phoneListing["uid"] = uid;
  phoneListing["image"] = "/phone_default_images/" + phoneListing["brand"] + ".png";
  if (!(phoneListing["disabled"] == true || phoneListing["disabled"] == false) || phoneListing["disabled"] === "") {
    phoneListing["disabled"] = typeof phoneListing.disabled !== 'undefined';
  }
  phoneListings[i] = phoneListing;
}

json["Phones"] = phoneListings;
FileSystem.writeFile('phonelisting_demo.json', JSON.stringify(json, null, 2), (error) => {
  if (error) throw error;
});
