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
        maxAge: 6000000, // 1 minute
      },
         store: new MongoStore({
           mongooseConnection: mongoose.connection,
           ttl: 60 * 60 * 24, // 60 secs 60 min 24 hour
         }),
    })
  );
};


