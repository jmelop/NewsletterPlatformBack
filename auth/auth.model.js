var mongoose = require("mongoose");

var authSchema = mongoose.Schema({
  name: {
    type: String,
    minLength: [2, "Nombre demasiado corto"],
    maxLength: [100, "Nombre demasiado largo"],
  },
  email: {
    type: String,
    unique: true,
    validate: {
      validator: function (v) {
        return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v);
      },
      message: "Introduce un email válido",
    },
    required: [true, "Email requerido"],
  },
  role: {
    type: String,
    enum: ["admin", "user"],
    default: "user",
  },
  password: {},
  tag: {
    type: Array,
    default: [],
  },
});

var auth = mongoose.model("users", authSchema);
module.exports = auth;
