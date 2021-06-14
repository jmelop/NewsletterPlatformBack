const router = require("express").Router();
const {
  login,
  register,
  forgotPassword,
  changePassword,
} = require("./auth.admin.controller");

router.post("/login", login);
router.post("/register", register);

router.post("/forgot", forgotPassword);
router.post("/recover", changePassword);

module.exports = router;
