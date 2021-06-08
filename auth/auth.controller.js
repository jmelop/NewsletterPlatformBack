const authModel = require("./auth.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

module.exports = { login, register };

function login(req, res) {
  const { email, password } = req.body;
  authModel
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
  var newUser = new authModel(req.body);
  var error = newUser.validateSync();
  if (!error) {
    let passwordHash = bcrypt.hashSync(newUser.password, 4);
    authModel
      .create({
        email: newUser.email,
        password: passwordHash,
        name: newUser.name,
        role: newUser.role,
        tags: newUser.tags,
      })
      .then((r) => {
        res.send(r);
      })
      .catch((err) => {
        if (err.keyValue.email) {
          res.status(404).send("Email repetido");
        } else {
          res.status(500).send("Fallo en el servidor");
        }
      });
  } else {
    if (error.errors.role) {
      res.status(403).send("Rol no valido");
    }
    if (error.errors.email) {
      res.status(403).send("email no valido");
    }
  }
}
