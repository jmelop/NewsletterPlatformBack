var mongoose = require("mongoose");

var sendDateSchema = mongoose.Schema({
  date: {
    type: String,
  },
});

var sendDate = mongoose.model("senddate", sendDateSchema);
module.exports = sendDate;
