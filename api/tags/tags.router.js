const tagsController = require("./tags.controller");
const router = require("express").Router();

router.get("/", tagsController.getAllTags);

router.get("/:id", tagsController.getTagById);

router.post("/", tagsController.createTag);

router.delete("/:id", tagsController.deleteTag);

router.patch("/:id", tagsController.editTag);

module.exports = router;
