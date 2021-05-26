const newsController = require("./news.controller");
var router = require("express").Router();

router.get("/", newsController.getAllnews);

router.get("/:id", newsController.getnewById);

router.post("/", newsController.createnew);

router.delete("/:id", newsController.deletenew);

module.exports = router;
