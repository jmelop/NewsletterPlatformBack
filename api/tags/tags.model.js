var mongoose = require("mongoose");

var tagsSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, "Requiere un nombre"],
  },
});

var tweet = mongoose.model("tag", tagsSchema);
module.exports = tweet;
