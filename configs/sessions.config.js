const session = require("express-session");
const mongoose = require("mongoose");
const MongoStore = require("connect-mongo")(session);

module.exports = (app) => {
  app.use(
    session({
      secret: process.env.SESS_SECRET,
      resave: false,
      saveUninitialized: true,
      cookie: {
        maxAge: 60000, // 1 minute
      },
    })
  );
};
