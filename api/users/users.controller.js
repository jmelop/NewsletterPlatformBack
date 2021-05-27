const userModel = require("./users.model");
var mongoose = require("mongoose");

module.exports = {
  getAllUsers,
  getById,
  createUser,
  editPatch,
  deleteUser,
};

function getAllUsers(req, res) {
  userModel
    .find()
    .then((response) => {
      res.json(response);
    })
    .catch((err) => res.status(500).json(err));
}

function getById(req, res) {
  let userId = mongoose.Types.ObjectId.isValid(req.params.id);

  if (userId) {
    userModel
      .findById(req.params.id)
      .then((r) => res.json(r))
      .catch((err) => res.status(500).json("Error en la base de datos"));
  } else {
    res.status(404).send("Ningun usuario encontrado");
  }
}

function createUser(req, res) {
  var newUser = new userModel(req.body);

  var error = newUser.validateSync();
  if (!error) {
    newUser
      .save()
      .then((u) => {
        res.json(u);
      })
      .catch((err) => res.status(500).json(err));
  } else {
    res.status(403).send("Email no valido");
  }
}
function editPatch(req, res) {
  let userId = mongoose.Types.ObjectId.isValid(req.params.id);

  if (userId) {
    userModel
      .findByIdAndUpdate(req.params.id, req.body)
      .then((r) => res.json(r))
      .catch((err) => res.status(500).json("Error en la base de datos"));
  } else {
    res.status(404).send("Ningun usuario encontrado");
  }
}

function deleteUser(req, res) {
  let userId = mongoose.Types.ObjectId.isValid(req.params.id);
  if (userId) {
    userModel
      .findByIdAndDelete(req.params.id)
      .then((r) => res.json(r))
      .catch((err) => res.status(500).json("Error en la base de datos"));
  } else {
    res.status(404).send("Ningun usuario encontrado");
  }
}
