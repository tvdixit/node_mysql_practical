const express = require("express");
const userController = require("../controlller/userController");
const router = express.Router();

router.post("/createuser", userController.createUser);
router.get("/getuser", userController.getuser);

module.exports = router;
