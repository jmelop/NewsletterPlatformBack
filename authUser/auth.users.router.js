var router = require("express").Router();
var { login, register } = require("./auth.users.controller");

router.post("/login", login);
router.post("/register", register);

module.exports = router;
