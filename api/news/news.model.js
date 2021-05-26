var mongoose = require("mongoose");

var newsSchema = mongoose.Schema({
  title: {
    type: String,
    minLength: [2, "Título demasiado corto"],
  },
  body: {
    type: String,
    minLength: [2, "Body demasiado corto"],
  },
  link: {
    type: String,
    required: false,
  },
  tag: {
    type: Array,
    required: [true, "Tag obligatorio"],
  },
});

var news = mongoose.model("new", newsSchema);
module.exports = news;
