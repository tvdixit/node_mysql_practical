const express = require("express");
const router = express.Router();
const { createUser, getuser, Login } = require("../controlller/userController");

router
  .post("/createuser", createUser)
  .get("/getuser", getuser)
  .post("/login", Login);

module.exports = { route: router };
