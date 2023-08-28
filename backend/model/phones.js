const db = require("../db/db");

module.exports.getSoldOutSoon = async function() {
	const phonesRef = db.collection("Phones");
  const queryRes = await phonesRef.where("stock", ">", 0).where("disabled", "==", false).orderBy("stock").limit(5).get();
  
  if (queryRes.empty) {
    return [];
  }

  const results = queryRes.docs.map(doc => doc.data());
  
  return results;
}

module.exports.getBestSellers = async function() {
	const phonesRef = db.collection("Phones");
	const queryRes = await phonesRef.where("disabled", "==", false).orderBy("avgRatings", "desc").get();

	if (queryRes.empty) {
		return [];
	}

	const docs = queryRes.docs;
	const docsLength = docs.length;
	const results = [];
	var counter = 0;

	for (let i = 0; i < docsLength; i++) {
		const doc = docs[i];
		const data = doc.data();

		if (data.stock > 0 && data.numReviews > 1) {
			results.push(data);
			counter++;
		}

		if (counter == 5) {
			break;
		}
	}

	return results;
}

module.exports.searchTitle = async function(searchTerm) {
	const phonesRef = db.collection("Phones");
	const queryRes = await phonesRef.where("stock", ">", 0).where("disabled", "==", false).get();

	if (queryRes.empty) {
		return [];
	}

	const docs = queryRes.docs;
	const results = [];

	for (const doc of docs) {
		const data = doc.data();
		if (data.title.includes(searchTerm)) {
			results.push(data);
		}
	}

	return results;
}