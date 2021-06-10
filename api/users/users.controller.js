const userModel = require("./users.model");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

module.exports = {
  getAllUsers,
  getById,
  createUser,
  editPatch,
  deleteUser,
  deleteSelfUser,
  deleteTagUser,
  editSelf,
  getByOwnerId,
};

function deleteTagUser(id) {
  return userModel.updateMany({ tags: id }, { $pull: { tags: id } });
}

function getAllUsers(req, res) {
  if (req.currentUser.role === "admin") {
    userModel
      .find()
      .populate("tags")
      .populate("owner")
      .then((response) => {
        res.json(response);
      })
      .catch((err) => res.status(500).json(err));
  } else {
    res.status(403).send("No eres admin");
  }
}

function getById(req, res) {
  if (req.currentUser.role === "admin" || req.currentUser.role === "user") {
    let userId = mongoose.Types.ObjectId.isValid(req.params.id);

    if (userId) {
      userModel
        .findById(req.params.id)
        .populate("tags")
        .populate("owner")
        .then((r) => res.json(r))
        .catch((err) => res.status(500).json("Ha ocurrido un error"));
    } else {
      res.status(404).send("Ningun usuario encontrado");
    }
  } else {
    res.status(403).send("No eres admin");
  }
}

function createUser(req, res) {
  if (req.currentUser.role === "admin") {
    var newUser = new userModel(req.body);

    var error = newUser.validateSync();
    if (!error) {
      let passwordHash = bcrypt.hashSync(newUser.password, 4);
      userModel
        .create({
          email: newUser.email,
          password: passwordHash,
          name: newUser.name,
          role: newUser.role,
          tags: newUser.tags,
          owner: newUser.owner,
        })
        .then((r) => {
          res.json(r);
        })
        .catch((err) => {
          if (err.keyValue.email) {
            res.status(400).send("Email repetido");
          } else {
            res.status(500).send("Ha ocurrido un error");
          }
        });
    } else {
      if (error.errors.email) {
        res.status(400).send("email no valido");
      } else {
        res.status(400).send("Ha ocurrido un error");
      }
    }
  } else {
    res.status(403).send("No eres admin");
  }
}

function editPatch(req, res) {
  if (req.currentUser.role === "admin") {
    let userId = mongoose.Types.ObjectId.isValid(req.params.id);

    if (userId) {
      userModel
        .findByIdAndUpdate(req.params.id, req.body)
        .then((r) => res.json(r))
        .catch((err) => res.status(500).json("Error en la base de datos"));
    } else {
      res.status(404).send("Ningun usuario encontrado");
    }
  } else {
    res.status(403).send("No eres admin");
  }
}

function deleteUser(req, res) {
  if (req.currentUser.role === "admin") {
    let userId = mongoose.Types.ObjectId.isValid(req.params.id);
    if (userId) {
      userModel
        .findByIdAndDelete(req.params.id)
        .then((r) => res.json(r))
        .catch((err) => res.status(500).json("Error en la base de datos"));
    } else {
      res.status(404).send("Ningun usuario encontrado");
    }
  } else {
    res.status(403).send("No eres admin");
  }
}

function deleteSelfUser(req, res) {
  let userId = mongoose.Types.ObjectId.isValid(req.params.id);
  if (userId) {
    userModel
      .findById(req.params.id)
      .then((r) => {
        if (r.email === req.currentUser.email) {
          userModel
            .findByIdAndDelete(req.params.id)
            .then((r) => res.send("Eliminado con exito"));
        } else {
          res
            .status(400)
            .send("El email actual no coincide con el email a eliminar");
        }
      })
      .catch((err) => res.status(500).json("Ningun usuario con ese ID"));
  } else {
    res.status(404).send("Ningun usuario encontrado");
  }
}

function editSelf(req, res) {
  let userId = mongoose.Types.ObjectId.isValid(req.params.id);
  if (userId) {
    userModel
      .findById(req.params.id)
      .then((r) => {
        if (r.email === req.currentUser.email) {
          userModel
            .findByIdAndUpdate(req.params.id, req.body)
            .then((r) => res.send(r));
        } else {
          res
            .status(400)
            .send("El email actual no coincide con el email a editar");
        }
      })
      .catch((err) => res.status(500).json("Error en la base de datos"));
  } else {
    res.status(404).send("Ningun usuario encontrado");
  }
}
function getByOwnerId(req, res) {
  if (req.currentUser.role === "admin") {
    userModel
      .find({ owner: req.params.id })
      .populate("owner")
      .then((r) => res.send(r))
      .catch((err) => res.status(404).send("Usuario no encontrado"));
  } else {
    res.status(403).send("No eres admin");
  }
}

/* 
function deleteSelfTags(req, res) {
  userModel.findById(req.params.id).then((r) => {
    if (r.email === req.currentUser.email) {
    }
  });
} */
