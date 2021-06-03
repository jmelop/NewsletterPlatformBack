const sendDateController = require("./sendDate.controller");
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

router.get("/", validAuth, sendDateController.getAllDates);

router.get("/:id", validAuth, sendDateController.getDateById);

router.patch("/:id", validAuth, sendDateController.editDate);

module.exports = router;
