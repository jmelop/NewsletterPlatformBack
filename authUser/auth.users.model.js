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
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "admin",
      required: [true, "owner requerido"],
    },

    role: {
      type: String,
      enum: ["user"],
      default: "user",
    },
    password: {
      type: String,
      required: [true, "Password requerida"],
    },
    tags: [{ type: mongoose.Schema.Types.ObjectId, ref: "tag" }],
  },
  { timestamps: { createdAt: "createdAt" } }
);

var auth = mongoose.model("users", authSchema);
module.exports = auth;
