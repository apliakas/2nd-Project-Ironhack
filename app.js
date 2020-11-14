require("dotenv").config();

const path = require("path");
const hbs = require("hbs");
const express = require("express");
const mongoose = require("mongoose");
const logger = require("morgan");

const app = express();

require("./routes/routes.js");

app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));

const index = require("./routes/routes");
app.use("/", index);

app.use(logger("dev"));

app.listen(3000);
