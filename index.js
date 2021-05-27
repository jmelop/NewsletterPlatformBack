const express = require("express");
const app = express();
require("dotenv").config();

app.use(express.json());

const mongoose = require("mongoose");
mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
});

app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:4200");

  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );

  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type"
  );

  res.setHeader("Access-Control-Allow-Credentials", true);
  next();
});

//router
const routerUser = require("./api/users/users.router.js");
const routerNews = require("./api/news/news.router.js");
const routerTags = require("./api/tags/tags.router.js");
const routerAuth = require("./auth/auth.router");

app.use("/users", routerUser);
app.use("/news", routerNews);
app.use("/tags", routerTags);
app.use("/", routerAuth);

app.listen(4000);
