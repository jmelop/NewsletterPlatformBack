const sendDatesModel = require("./sendDate.model");
const mongoose = require("mongoose");
module.exports = {
  getAllDates,
  getDateById,
  editDate,
};

function getAllDates(req, res) {
  sendDatesModel
    .find()
    .then((r) => {
      res.json(r);
      console.log(r);
    })
    .catch((err) => res.status(500).json(err));
}

function getDateById(req, res) {
  let sendDateId = mongoose.Types.ObjectId.isValid(req.params.id);
  if (sendDateId) {
    sendDatesModel
      .findById(req.params.id)
      .then((r) => {
        res.json(r);
      })
      .catch((err) => res.status(500).json(err));
  } else {
    res.status(404).send("Ninguna fecha encontrada");
  }
}

function editDate(req, res) {
  let sendDateId = mongoose.Types.ObjectId.isValid(req.params.id);
  if (sendDateId) {
    sendDatesModel
      .findByIdAndUpdate(req.params.id, req.body)
      .then((r) => {
        res.json(r);
      })
      .catch((err) => res.status(500).json(err));
  } else {
    res.status(404).send("Ninguna fecha encontrada");
  }
}
