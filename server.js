const express = require("express");
const app = express();
const port = process.env.PORT || 4000;
const path = require("path");
const md5 = require("md5");
let { Sequelize, sequelize, Account } = require("./models/index");

Account.findAll().then((accounts) => {
  console.log(`All accounts: ${JSON.stringify(accounts)}`);
});

// console.log(sequelize);

// Allows us to serve static react file from build/ directory
app.use(express.static(path.join(__dirname, "build")));

// Serves react app
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/build/" + "index.html");
});

// Checks whether given username/password pair is valid
app.get("/authenticate-login", (req, res) => {
  let { username, password } = req.query;

  Account.findByPk(username).then((account) => {
    let { salt, md5_hashed_password } = account.dataValues;
    let loginSuccessful = md5(password + salt) === md5_hashed_password;

    res.send(loginSuccessful);
  });
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
