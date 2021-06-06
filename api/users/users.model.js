var mongoose = require("mongoose");
var usersSchema = mongoose.Schema(
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
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },
    password: {
      type: String,
      required: [true, "Password necesaria"],
    },
    tags: [{ type: mongoose.Schema.Types.ObjectId, ref: "tag" }],
  },
  { timestamps: { createdAt: "createdAt" } }
);

var user = mongoose.model("user", usersSchema);
module.exports = user;
