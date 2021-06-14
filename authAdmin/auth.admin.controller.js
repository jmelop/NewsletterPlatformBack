const authAdminModel = require("./auth.admin.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const axios = require("axios");
require("dotenv").config();
module.exports = { login, register, forgotPassword, changePassword };

function sendAdminId(id) {
  return axios
    .get(process.env.SEND_EMAIL_URL + "newadmin" + id)
    .then((r) => console.log(r))
    .catch((err) => console.log(err));
}

function login(req, res) {
  const { email, password } = req.body;
  authAdminModel
    .findOne({ email })
    .then((r) => {
      if (!r) {
        res.status(404).send("No existe ningun usuario con ese email");
      } else if (r.password == null) {
        res.status(400).send("Email o pasdword no válida");
      } else {
        if (!bcrypt.compareSync(password, r.password)) {
          res.status(404).send("Email o password no válida");
        } else {
          const token = jwt.sign(
            { email: r.email, role: r.role, id: r._id },
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
  var newUser = new authAdminModel(req.body);
  var error = newUser.validateSync();
  if (!error) {
    let passwordHash = bcrypt.hashSync(newUser.password, 4);
    authAdminModel
      .create({
        username: newUser.username,
        email: newUser.email,
        password: passwordHash,
        name: newUser.name,
        role: newUser.role,
        tags: newUser.tags,
      })
      .then((r) => {
        sendAdminId(r._id);
        res.send(r);
      })
      .catch((err) => {
        if (err.keyValue.email) {
          res.status(400).send("Email repetido");
        } else if (err.keyValue.username) {
          res.status(400).send("Username repetido");
        } else {
          res.status(500).send("Fallo en el servidor");
        }
      });
  } else {
    if (error.errors.email) {
      res.status(400).send("email no valido");
    } else if (error.errors.username) {
      res.status(400).send("username necesario");
    }
  }
}

function forgotPassword(req, res) {
  let emailReq = req.body.email;
  authAdminModel
    .findOne({ email: emailReq })
    .then((r) => {
      if (r == null) {
        res.status(404).send("Email no encontrado");
      } else {
        const token = jwt.sign(
          { email: r.email, date: new Date().getTime() },
          process.env.TOKEN_PASSWORD
        );
        console.log(token);
        authAdminModel
          .findByIdAndUpdate(r._id, { recoverToken: token }, { new: true })
          .then((res) => {
            return axios
              .post(process.env.SEND_EMAIL_URL + "recover", {
                recoverToken: token,
                email: r.email,
                name: r.name,
              })
              .then((r) => {
                res.send(r);
              })
              .catch((err) => console.log(err));
          })
          .catch((err) => console.log(err.message));
      }
    })
    .catch((err) => console.log(err.message));
}

function changePassword(req, res) {
  token = req.body.token;
  let passwordHash = bcrypt.hashSync(req.body.password, 4);

  jwt.verify(token, process.env.TOKEN_PASSWORD, (err, data) => {
    if (err) {
      return res.status(403).send("Token invalido");
    } else {
      const newDate = new Date().getTime();
      const finalDate = newDate - data.date;

      if (finalDate < 3600000) {
        authAdminModel.findOne({ email: data.email }).then((r) => {
          if (r.recoverToken === token) {
            authAdminModel
              .findOneAndUpdate(
                { email: data.email },
                { password: passwordHash }
              )
              .then((r) => res.send(r))
              .catch((err) => console.log(err.message));
          } else {
            res.status(403).send("Token no coincide");
          }
        });
      } else {
        res.status(400).send("Has superado el tiempo de recuperación");
      }
    }
  });
}
