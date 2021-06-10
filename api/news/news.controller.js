const newsModel = require("./news.model");
var mongoose = require("mongoose");

module.exports = {
  createnew,
  getAllnews,
  getnewById,
  deletenew,
  editNew,
  getByOwnerId,
};

function getAllnews(req, res) {
  if (req.currentUser.role === "admin" || req.currentUser.role === "user") {
    newsModel
      .find()
      .populate("tag")
      .populate("owner")
      .then((response) => {
        res.json(response);
      })
      .catch((err) => res.status(500).json(err));
  } else {
    res.status(403).send("Rol no válido");
  }
}

function getnewById(req, res) {
  if (req.currentUser.role === "admin ") {
    let newId = mongoose.Types.ObjectId.isValid(req.params.id);
    if (newId) {
      newsModel
        .findById(req.params.id)
        .populate("tag")
        .populate("owner")
        .then((response) => {
          res.json(response);
        })
        .catch((err) => res.status(500).json(err));
    } else {
      res.status(404).send("Ningun new encontrado");
    }
  } else {
    res.status(403).send("No eres admin");
  }
}

function createnew(req, res) {
  if (req.currentUser.role === "admin") {
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
      if (error.errors.tag) {
        res.status(404).send("Tags obligatorios");
      }
      if (error.errors.title) {
        res.status(404).send("Titulo obligatorios");
      }
      if (error.errors.body) {
        res.status(404).send("body obligatorios");
      }
    }
  } else {
    res.status(403).send("No eres admin");
  }
}

function deletenew(req, res) {
  if (req.currentUser.role === "admin") {
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
  } else {
    res.status(403).send("No eres admin");
  }
}

function editNew(req, res) {
  if (req.currentUser.role === "admin") {
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
  } else {
    res.status(403).send("No eres admin");
  }
}

function getByOwnerId(req, res) {
  if (req.currentUser.role === "admin") {
    newsModel
      .find({ owner: req.params.id })
      .then((r) => res.send(r))
      .catch((err) => res.status(404).send("Noticia no encontrada"));
  } else {
    res.status(403).send("No eres admin");
  }
}
