const userModel = require("./users.model");
var mongoose = require("mongoose");

module.exports = {
  getAllUsers,
  getById,
  createUser,
  editPatch,
  deleteUser,
  deleteSelfUser,
  deleteTagUser,
};

function deleteTagUser(id) {
  /*userModel.find().then((u) => {
    u.forEach((user) =>
      user.tag.forEach((t) => {
        if (t._id == id) {
          user.tag = user.tag.filter((tag) => tag._id != id);
          console.log(user);
          const user1 = {
            role: user.role,
            tag: user.tag,
            _id: user._id,
            name: user.name,
            email: user.email,
            password: user.password,
            __v: 0,
          };
          userModel
            .findOneAndReplace({ _id: user._id }, user1)
            .then((r) => console.log(r))
            .catch((err) => console.log(err));
        }
      })
    );
  }); */
  user = userModel.find();
  user
    .updateMany({}, { $pull: { tags: id } })
    .then((r) => console.log(r))
    .catch((err) => console.log(err));
}

function getAllUsers(req, res) {
  if (req.currentUser.role === "admin") {
    userModel
      .find()
      .populate("tags")
      .then((response) => {
        res.json(response);
      })
      .catch((err) => res.status(500).json(err));
  } else {
    res.status(403).send("No eres admin");
  }
}

function getById(req, res) {
  if (req.currentUser.role === "admin") {
    let userId = mongoose.Types.ObjectId.isValid(req.params.id);

    if (userId) {
      userModel
        .findById(req.params.id)
        .then((r) => res.json(r))
        .catch((err) => res.status(500).json("Error en la base de datos"));
    } else {
      res.status(404).send("Ningun usuario encontrado");
    }
  } else {
    res.status(403).send("No eres admin");
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
      .catch((err) => {
        if (err.keyValue.email) {
          res.status(404).send("Email repetido");
        } else {
          res.status(500).send("Fallo en el servidor");
        }
      });
  } else {
    if (error.errors.role) {
      res.status(403).send("Rol no valido");
    }
    if (error.errors.email) {
      res.status(403).send("email no valido");
    }
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
            .status(403)
            .send("El email actual no coincide con el email a eliminar");
        }
      })
      .catch((err) => res.status(500).json("Error en la base de datos"));
  } else {
    res.status(404).send("Ningun usuario encontrado");
  }
}
