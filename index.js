var express = require("express");
var app = express();
app.use(express.json());

var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/appNewsletter", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
});

//router
var routerUser = require("./api/users/users.router.js");
var routerNews = require("./api/news/news.router.js");
app.use("/users", routerUser);
app.use("/news", routerNews);

app.listen(4000);
