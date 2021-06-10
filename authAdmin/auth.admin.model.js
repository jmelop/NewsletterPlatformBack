var mongoose = require("mongoose");

var authSchema = mongoose.Schema(
  {
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
    username: {
      type: String,
      unique: true,
      required: [true, "Nombre de usuario requerido"],
    },
    role: {
      type: String,
      enum: ["admin"],
      default: "admin",
    },
    password: {
      type: String,
      required: [true, "Password requerida"],
    },
    senddate: {
      type: String,
      default: "0 12 ? * FRI",
    },
  },
  { timestamps: { createdAt: "createdAt" } }
);

var auth = mongoose.model("admin", authSchema);
module.exports = auth;
