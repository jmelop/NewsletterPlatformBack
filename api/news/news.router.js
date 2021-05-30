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
    }
    console.log(data);
    req.currentUser = data;
    if (req.currentUser.role == "admin") {
      next();
    } else {
      res.status(403).send("No tienes permisos");
    }
  });
}

router.get("/", validAuth, newsController.getAllnews);

router.get("/:id", validAuth, newsController.getnewById);

router.post("/", validAuth, newsController.createnew);

router.patch("/:id", validAuth, newsController.editNew);

router.delete("/:id", validAuth, newsController.deletenew);

module.exports = router;
