var router = require("express").Router();
var {
  login,
  register,
  forgotPassword,
  changePassword,
} = require("./auth.users.controller");

router.post("/login", login);
router.post("/register", register);

router.post("/forgot", forgotPassword);
router.post("/recover", changePassword);

module.exports = router;
