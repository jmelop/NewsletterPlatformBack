var router = require("express").Router();
const jwt = require("jsonwebtoken");

var userController = require("./users.controller");

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

router.get("/", validAuth, userController.getAllUsers);

router.get("/owner", validAuth, userController.getByOwnerId);

router.get("/:id", validAuth, userController.getById);

router.post("/", validAuth, userController.createUser);

router.patch("/:id", validAuth, userController.editPatch);

router.delete("/:id", validAuth, userController.deleteUser);

router.delete("/deleteSelf/:id", validAuth, userController.deleteSelfUser);

router.patch("/editself/:id", validAuth, userController.editSelf);

module.exports = router;
