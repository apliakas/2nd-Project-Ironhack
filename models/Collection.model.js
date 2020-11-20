const mongoose = require("mongoose");

const collectionSchema = new mongoose.Schema({
  collections: {
    type: Array,
    default: [],
    image: String,
    title: String,
  },
  publicLink: {
    type: String,
  },
});

const Collection = mongoose.model("Collection", collectionSchema);
module.exports = Collection;
