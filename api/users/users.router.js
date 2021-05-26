var router = require("express").Router();

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
router.delete("/:id", userController.deleteUser);

module.exports = router;
