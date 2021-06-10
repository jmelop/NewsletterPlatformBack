const tagsController = require("./tags.controller");
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

router.get("/", validAuth, tagsController.getAllTags);

router.get("/owner/:id", validAuth, tagsController.getByOwnerId);

router.get("/:id", validAuth, tagsController.getTagById);

router.post("/", validAuth, tagsController.createTag);

router.delete("/:id", validAuth, tagsController.deleteTag);

router.patch("/:id", validAuth, tagsController.editTag);

module.exports = router;
