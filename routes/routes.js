const express = require("express");
const router = express.Router();
const PORT = process.env.PORT;
const User = require("../models/User.model");
const bcrypt = require("bcrypt");
const saltRounds = 12;
const mongoose = require("mongoose");
const session = require("express-session");

router.get("/", (req, res) => {
  console.log();
  res.render("index");
});

module.exports = router;
