const tagsModel = require("./tags.model");
const mongoose = require("mongoose");
const { response } = require("express");

module.exports = {
  getAllTags,
  getTagById,
  editTag,
  deleteTag,
  createTag,
};

function getAllTags(req, res) {
  tagsModel
    .find()
    .then((r) => {
      res.json(r);
    })
    .catch((err) => res.status(500).json(err));
}

function getTagById(req, res) {
  let tagId = mongoose.Types.ObjectId.isValid(req.params.id);
  if (tagId) {
    tagsModel
      .findById(req.params.id)
      .then((r) => {
        res.json(r);
      })
      .catch((err) => res.status(500).json(err));
  } else {
    res.status(404).send("Ningun tag encontrado");
  }
}

function createTag(req, res) {
  var createTag = new tagsModel(req.body);
  var error = createTag.validateSync();
  if (!error) {
    createTag
      .save()
      .then((u) => res.json(u))
      .catch((err) => res.status(500).json(err));
  } else {
    res.json(error.errors);
  }
}

function deleteTag(req, res) {
  let tagId = mongoose.Types.ObjectId.isValid(req.params.id);
  if (tagId) {
    tagsModel
      .findByIdAndDelete(req.params.id)
      .then((r) => {
        res.json(r);
      })
      .catch((err) => res.status(500).json(err));
  } else {
    res.status(404).send("Ningun tag encontrado");
  }
}

function editTag(req, res) {
  let tagId = mongoose.Types.ObjectId.isValid(req.params.id);
  if (tagId) {
    tagsModel
      .findByIdAndUpdate(req.params.id, req.body)
      .then((r) => {
        res.json(r);
      })
      .catch((err) => res.status(500).json(err));
  } else {
    res.status(404).send("Ningun tag encontrado");
  }
}
