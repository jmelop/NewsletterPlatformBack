var mongoose = require("mongoose");

var tagsSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, "Requiere un nombre"],
  },
});

var tags = mongoose.model("tag", tagsSchema);
module.exports = tags;
