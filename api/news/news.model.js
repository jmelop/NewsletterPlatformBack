var mongoose = require("mongoose");

var newsSchema = mongoose.Schema(
  {
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
    tag: [{ type: mongoose.Schema.Types.ObjectId, ref: "tag", require: true }],
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "admin",
      required: [true, "owner requerido"],
    },
  },
  { timestamps: { createdAt: "createdAt" } }
);

var news = mongoose.model("new", newsSchema);
module.exports = news;
