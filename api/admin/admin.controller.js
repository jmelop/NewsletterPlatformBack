const adminModel = require("./admin.model");
const mongoose = require("mongoose");
require("dotenv").config();
const axios = require("axios");

module.exports = {
  getAllAdmins,
  getById,
  editPatch,
  editSelf,
  deleteSelfAdmin,
};

function settime(id) {
  return axios
    .get(process.env.SEND_EMAIL_URL + "settime/" + id)
    .then((r) => console.log(r))
    .catch((err) => console.log(err.message));
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
        .then((r) => {
          settime(r._id);
          res.json(r);
        })
        .catch((err) => res.status(500).json(err));
    } else {
      res.status(404).send("Ningun usuario encontrado");
    }
  } else {
    res.status(403).send("No eres admin");
  }
}

function editSelf(req, res) {
  if (req.currentUser.role === "admin") {
    let adminId = mongoose.Types.ObjectId.isValid(req.params.id);
    if (adminId) {
      adminModel
        .findById(req.params.id)
        .then((r) => {
          if (r.email === req.currentUser.email) {
            adminModel
              .findByIdAndUpdate(req.params.id, req.body)
              .then((r) => {
                settime(r._id);
                res.json(r);
              })
              .catch((err) => console.log(err));
          } else {
            res
              .status(400)
              .send("El email actual no coincide con el email a editar");
          }
        })
        .catch((err) => send.status(404).send("Ningun admin con ese ID"));
    } else {
      res.status(404).send("Ningun usuario encontrado");
    }
  } else {
    res.status(403).send("No eres admin");
  }
}

function deleteSelfAdmin(req, res) {
  if (req.currentUser.role === "admin") {
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
        .catch((err) => send.status(404).send("Ningun admin con ese ID"));
    } else {
      res.status(404).send("Ningun usuario encontrado");
    }
  } else {
    res.status(403).send("No eres admin");
  }
}
