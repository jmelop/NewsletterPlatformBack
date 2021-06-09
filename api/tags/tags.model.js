var mongoose = require("mongoose");

var tagsSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, "Requiere un nombre"],
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "admin",
    required: [true, "owner requerido"],
  },
});

var tags = mongoose.model("tag", tagsSchema);
module.exports = tags;
