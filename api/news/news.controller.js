const newsModel = require("./news.model");
var mongoose = require("mongoose");

module.exports = {
  createnew,
  getAllnews,
  getnewById,
  deletenew,
  editNew,
};

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
  var createNew = new newsModel(req.body);
  var error = createNew.validateSync();
  if (!error) {
    createNew
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
    newsModel
      .findByIdAndDelete(req.params.id)
      .then((u) => {
        res.json(u);
      })
      .catch((err) => res.status(500).json(err));
  } else {
    res.status(404).send("Ningun new encontrado");
  }
}

function editNew(req, res) {
  let newId = mongoose.Types.ObjectId.isValid(req.params.id);
  if (newId) {
    newsModel
      .findByIdAndUpdate(req.params.id, req.body)
      .then((u) => {
        res.json(u);
      })
      .catch((err) => res.status(500).json(err));
  } else {
    res.status(404).send("Ningun new encontrado");
  }
}
