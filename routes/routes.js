const express = require("express");
const router = express.Router();
const PORT = process.env.PORT;
const User = require("../models/User.model");
const bcrypt = require("bcrypt");
const saltRounds = 12;
const mongoose = require("mongoose");
const session = require("express-session");

router.get("/", (req, res) => {
  res.render("index", {
    userInSession: req.session.user,
  });
});

router.get("/signup", (req, res) => res.render("signup"));

router.post("/signup", (req, res) => {
  const {
    username,
    email,
    firstName,
    lastName,
    favArtist,
    password,
  } = req.body;
  bcrypt
    .hash(password, saltRounds)
    .then((hashedPassword) => {
      User.create({
        username,
        email,
        firstName,
        lastName,
        favArtist,
        passwordHash: hashedPassword,
      })
        .then((user) => {
          req.session.currentUser = user;
          res.redirect("/user-profile");
        })
        .catch((err) => {
          res.render("auth/signup", {
            errorMessage: "The username or email address is already in use.",
          });
        });
    })
    .catch((err) => console.error(err));
});

module.exports = router;
