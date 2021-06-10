const newsController = require("./news.controller");
const router = require("express").Router();
const jwt = require("jsonwebtoken");

function validAuth(req, res, next) {
  if (!req.headers.authorization) {
    return res.status(403).send("No tienes autorización");
  }
  const token = req.headers.authorization;
  jwt.verify(token, process.env.TOKEN_PASSWORD, (err, data) => {
    if (err) {
      return res.status(403).send("Token invalido");
    } else {
      console.log(data);
      req.currentUser = data;
      next();
    }
  });
}

router.get("/", validAuth, newsController.getAllnews);

router.get("/owner/:id", validAuth, newsController.getByOwnerId);

router.get("/:id", validAuth, newsController.getnewById);

router.post("/", validAuth, newsController.createnew);

router.patch("/:id", validAuth, newsController.editNew);

router.delete("/:id", validAuth, newsController.deletenew);

module.exports = router;
