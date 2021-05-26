const userModel = require("./users.model");

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
  userModel
    .findById(req.params.id)
    .then((r) => res.json(r))
    .catch((err) => res.status(404).json("Usuario no encotrado"));
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
    res.json(error.errors);
  }
}
function editPatch(req, res) {
  userModel
    .findByIdAndUpdate(req.params.id, req.body)
    .then((r) => res.json(r))
    .catch((err) => res.status(404).json("Usuario no encotrado"));
}

function deleteUser(req, res) {
  userModel
    .findByIdAndDelete(req.params.id)
    .then((r) => res.json(r))
    .catch((err) => res.status(404).json("Usuario no encotrado"));
}
