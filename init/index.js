const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/llisting.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() { 
  await mongoose.connect(MONGO_URL);
}

const categories = [
  'Trending', 'Rooms', 'Mountains', 'Beach',
  'Iconic cities', 'Castles', 'Camping',
  'Farm', 'Arctic', 'Amazing Pools',
  'Domes', 'Boats'
];

const initDB = async () => {
  await Listing.deleteMany({});

  initData.data = initData.data.map((obj, index) => ({   // ✅ index added here
    ...obj,

    owner: '6961e8c706f480a7537a0e7a',

    geometry: {
      type: "Point",
      coordinates: [77.5946, 12.9716] // Bangalore
    },

    category: categories[index % categories.length],  // ✅ now works
  }));

  await Listing.insertMany(initData.data);
  console.log("data was initialized");
};

initDB();
