var mongoose = require("mongoose");

var newsSchema = mongoose.Schema({
  title: {
    type: String,
    minLength: [2, "Título demasiado corto"],
    required: true,
  },
  body: {
    type: String,
    minLength: [2, "Body demasiado corto"],
    required: true,
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
