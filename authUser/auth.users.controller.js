const authUserModel = require("./auth.users.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const authAdminModel = require("../authAdmin/auth.admin.model");
const mongoose = require("mongoose");

module.exports = { login, register };

function login(req, res) {
  const { email, password } = req.body;
  authUserModel
    .findOne({ email })
    .then((r) => {
      if (!r) {
        res.status(404).send("No existe ningun usuario con ese email");
      } else if (r.password == null) {
        res.status(404).send("Email o pasdword no válida");
      } else {
        if (!bcrypt.compareSync(password, r.password)) {
          res.status(404).send("Email o pasdword no válida");
        } else {
          const token = jwt.sign(
            { email: r.email, role: r.role },
            process.env.TOKEN_PASSWORD
          );

          return res.json({
            user: r,
            token: token,
          });
        }
      }
    })
    .catch((err) => console.log(err));
}

function register(req, res) {
  let adminId = mongoose.Types.ObjectId.isValid(req.body.owner);
  if (adminId) {
    authAdminModel
      .findById(req.body.owner)
      .then((r) => {
        if (r) {
          var newUser = new authUserModel(req.body);
          var error = newUser.validateSync();
          if (!error) {
            let passwordHash = bcrypt.hashSync(newUser.password, 4);
            authUserModel
              .create({
                email: newUser.email,
                password: passwordHash,
                name: newUser.name,
                role: newUser.role,
                tags: newUser.tags,
                owner: newUser.owner,
              })
              .then((r) => {
                res.send(r);
              })
              .catch((err) => {
                if (err.keyValue.email) {
                  res.status(400).send("Email repetido");
                } else {
                  res.status(500).send("Fallo en el servidor");
                }
              });
          } else {
            if (error.errors.role) {
              res.status(400).send("Rol no valido");
            }
            if (error.errors.email) {
              res.status(400).send("email no valido");
            }
            if (error.errors.owner) {
              res.status(400).send("owner necesario");
            }
          }
        }
      })
      .catch((err) => {
        res.status(404).send("Owner no encontrado");
      });
  } else {
    res.status(400).send("Id no válido");
  }
}
