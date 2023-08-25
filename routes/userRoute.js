const express = require("express");
const router = express.Router();
const { createUser, getuser, Login, sendMail } = require("../controlller/userController");

router
.get("/form", (req, res) => {
  res.render('createUser');
})
  .post("/createuser", createUser)
  .get("/getuser", getuser)
  .post("/login", Login)
  .post("/sendmail", sendMail);

module.exports = { route: router };
