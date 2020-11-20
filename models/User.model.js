const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  profilePhoto: {
    type: String,
  },
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  passwordHash: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  favArtist: {
    type: String,
    required: false,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
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

const User = mongoose.model("User", userSchema);
module.exports = User;
