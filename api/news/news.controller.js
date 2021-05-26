const newsModel = require("./news.model");
var mongoose = require("mongoose");

module.exports = {
  createnew,
  getAllnews,
  getnewById,
  deletenew,
  deleteOwnernews,
};

function deleteOwnernews(owner) {
  news = news.filter((u) => u.owner != owner);
}

function getAllnews(req, res) {
  newsModel
    .find()
    .then((response) => {
      res.json(response);
    })
    .catch((err) => res.status(500).json(err));
}

function getnewById(req, res) {
  let newId = mongoose.Types.ObjectId.isValid(req.params.id);
  if (newId) {
    newsModel
      .findById(req.params.id)
      .then((response) => {
        res.json(response);
      })
      .catch((err) => res.status(500).json(err));
  } else {
    res.status(404).send("Ningun new encontrado");
  }
}

function createnew(req, res) {
  var newnew = new newsModel(req.body);
  var error = newnew.validateSync();
  if (!error) {
    newnew
      .save()
      .then((u) => {
        res.json(u);
      })
      .catch((err) => res.status(500).json(err));
  } else {
    res.json(error.errors);
  }
}

function deletenew(req, res) {
  let newId = mongoose.Types.ObjectId.isValid(req.params.id);
  if (newId) {
    newsModel.deleteOne({ _id: req.params.id }).then((u) => {
      res.json(u);
    });
  } else {
    res.status(404).send("Ningun new encontrado");
  }
}
