var router = require("express").Router();
const jwt = require("jsonwebtoken");

//import functions from users.controller
var userController = require("./users.controller");

// router Get
router.get("/", userController.getAllUsers);
router.get("/:id", userController.getById);

//router post
router.post("/", userController.createUser);

//router patch
router.patch("/:id", userController.editPatch);

//router delete
router.delete(
  "/:id",
  (req, res, next) => {
    if (!req.headers.authorization) {
      return res.status(403).send("No eres admin");
    }
    const token = req.headers.authorization;
    jwt.verify(token, process.env.TOKEN_PASSWORD, (err, data) => {
      if (err) {
        return res.status(403).send("Token invalido");
      }
      console.log(data);
      req.createUser = data;
      next();
    });
  },
  userController.deleteUser
);

module.exports = router;
