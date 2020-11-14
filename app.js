require("dotenv").config();

const path = require("path");
const hbs = require("hbs");
const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

const app = express();

require("./routes/routes.js");
require("./configs/sessions.config")(app);
require("./configs/db.config");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(morgan("dev"));

app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));

app.use("/", require("./routes/routes"));

app.listen(process.env.PORT, () =>
  console.log(`App running on port ${process.env.PORT}`)
);

module.exports = app;
