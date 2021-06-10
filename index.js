const express = require("express");
const app = express();
require("dotenv").config();
const cors = require("cors");
app.use(cors());

app.use(express.json());

const mongoose = require("mongoose");
mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
});

app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");

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
const routerAuthUser = require("./authUser/auth.users.router");
const routerSendDate = require("./api/sendDate/sendDate.router");
const routerAuthAdmin = require("./authAdmin/auth.admin.router");
const routerAdmin = require("./api/admin/admin.router");

app.use("/users", routerUser);
app.use("/news", routerNews);
app.use("/tags", routerTags);
app.use("/senddate", routerSendDate);
app.use("/", routerAuthUser);
app.use("/admin", routerAuthAdmin);
app.use("/admin", routerAdmin);

app.listen(5000, () => console.log("Ready at port 5000"));
