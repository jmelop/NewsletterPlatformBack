const express = require("express");
const app = express();
app.use(express.json());

app.use(function (req, res, next) {
  // Website you wish to allow to connect
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:4200");

  // Request methods you wish to allow
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );

  // Request headers you wish to allow
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type"
  );

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader("Access-Control-Allow-Credentials", true);

  // Pass to next layer of middleware
  next();
});

const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/appNewsletter", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
});
//router
const routerUser = require("./api/users/users.router.js");
const routerNews = require("./api/news/news.router.js");
const routerTags = require("./api/tags/tags.router.js");
app.use("/users", routerUser);
app.use("/news", routerNews);
app.use("/tags", routerTags);

app.listen(4000);
