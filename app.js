require("dotenv").config();

const path = require("path");
const hbs = require("hbs");
const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");

const app = express();

app.use(morgan("dev"));

require("./routes/routes.js");
require("./configs/sessions.config")(app);
require("./configs/db.config");

app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));

const index = require("./routes/routes");
app.use("/", index);

app.listen(3000);
