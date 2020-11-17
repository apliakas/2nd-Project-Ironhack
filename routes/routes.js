const express = require("express");
const router = express.Router();
const PORT = process.env.PORT;
const User = require("../models/User.model");
const bcrypt = require("bcrypt");
const saltRounds = 12;
const mongoose = require("mongoose");
const session = require("express-session");
const axios = require("axios");
const fetch = require("node-fetch");
const util = require("util");
const hbs = require("hbs");

hbs.registerHelper("toJSON", function (object) {
  return new hbs.SafeString(JSON.stringify(object));
});

let artArr = [];
let resultsArr = [];

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
          req.session.user = user;
          res.redirect("/user-profile");
        })
        .catch((err) => {
          res.render("signup", {
            errorMessage: "The username or email address is already in use.",
          });
        });
    })
    .catch((err) => console.error(err));
});

router.get("/user-profile", (req, res) => {
  if (req.session.user) {
    const user = req.session.user;
    rijksFetchFavArtist(user);
    setTimeout(() => {
      res.render("user-profile", { userInSession: user });
    }, 500);
  } else {
    res.redirect("/login");
  }
});

router.get("/login", (req, res) => res.render("login"));

router.post("/login", (req, res) => {
  const { username, password } = req.body;
  User.findOne({ username })
    .then((user) => {
      if (!user) {
        res.render("login", {
          errorMessage: `Username not found. Please try again.`,
        });
        return;
      } else if (bcrypt.compareSync(password, user.passwordHash)) {
        req.session.user = user;
        res.redirect("/user-profile");
      } else {
        res.render("login", {
          errorMessage: "Incorrect password.",
        });
      }
    })
    .catch((err) => console.error(err));
});

router.get("/create", (req, res) => {
  if (req.session.user) {
    res.render("create", { userInSession: req.session.user });
  } else {
    res.redirect("/login");
  }
});

router.post("/create", (req, res) => {
  const user = req.session.user;
  user.artist = req.body.artist;
  if (req.session.user) {
    rijksFetchNewArtist(user);
    setTimeout(() => {
      res.render("create", { userInSession: user });
    }, 500);
  } else {
    res.redirect("/login");
  }
});

router.get("/add-to-project-board", (req, res) => res.redirect("/login"));

router.post("/add-to-project-board", (req, res) => {
  const user = req.session.user;
  const { projectBoardItemImage, projectBoardItemTitle } = req.body;
  if (req.session.user) {
    User.updateOne(
      { _id: user._id },
      {
        $push: {
          projectBoard: {
            image: projectBoardItemImage,
            title: projectBoardItemTitle,
          },
        },
      }
    )
      .then(() => {
        user.projectBoard.push({
          image: projectBoardItemImage,
          title: projectBoardItemTitle,
        });
        console.log(user.projectBoard);
      })
      .catch((err) => console.error(err));
    setTimeout(() => {
      res.render("create", { userInSession: user });
    }, 500);
  } else {
    res.redirect("/login");
  }
});

// router.post("/add-to-project-board", (req, res) => {
//   const user = req.session.user;
//   const { projectBoard } = req.body;
//   console.dir(projectBoard, { depth: null });
//   if (req.session.user) {
//     user.projectBoard.push(projectBoard);
//     console.dir(user.projectBoard, { depth: null });
//     setTimeout(() => {
//       res.render("create", { userInSession: user });
//     }, 500);
//   } else {
//     res.render("login");
//   }
// });

const rijksFetchFavArtist = (user) => {
  artArr.splice(0, artArr.length);
  const { favArtist } = user;
  axios
    .get(
      `https://www.rijksmuseum.nl/api/en/collection?key=Kp3DbvMR&involvedMaker=${favArtist}&ps=20&imgOnly=true&type=painting`
    )
    .then((res) => {
      for (let art of res.data.artObjects) {
        if (art.webImage) {
          artArr.push([art.longTitle, art.webImage.url]);
        }
      }
      return (user.favArtistInfo = artArr);
    })
    .catch((err) => console.error(err));
};

const rijksFetchNewArtist = (user) => {
  resultsArr.splice(0, resultsArr.length);
  axios
    .get(
      `https://www.rijksmuseum.nl/api/en/collection?key=Kp3DbvMR&involvedMaker=${user.artist}&ps=20&imgOnly=true&type=painting`
    )
    .then((res) => {
      for (let art of res.data.artObjects) {
        if (art.webImage) {
          resultsArr.push([art]);
        }
      }
      return (user.resultsArr = resultsArr);
    })
    .catch((err) => console.error(err));
};

module.exports = router;
