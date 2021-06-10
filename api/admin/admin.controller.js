const adminModel = require("./admin.model");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const axios = require("axios");

module.exports = {
  getAllAdmins,
  getById,
  editPatch,
  deleteUser,
  deleteSelfAdmin,
};

function sendAdminId(id) {
  return axios.get("localhost:3010/newadmin/" + id).then((r) => console.log(r));
}

function getAllAdmins(req, res) {
  if (req.currentUser.role === "admin") {
    adminModel
      .find()
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
      adminModel
        .findById(req.params.id)
        .populate("tags")
        .then((r) => res.json(r))
        .catch((err) => res.status(500).json("Error en la base de datos"));
    } else {
      res.status(404).send("Ningun usuario encontrado");
    }
  } else {
    res.status(403).send("No eres admin");
  }
}

function editPatch(req, res) {
  if (req.currentUser.role === "admin") {
    let adminId = mongoose.Types.ObjectId.isValid(req.params.id);

    if (adminId) {
      adminModel
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
      adminModel
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

function deleteSelfAdmin(req, res) {
  let adminId = mongoose.Types.ObjectId.isValid(req.params.id);

  if (adminId) {
    adminModel
      .findById(req.params.id)
      .then((r) => {
        if (r.email === req.currentUser.email) {
          adminModel
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
