const Connection = require("../config/db");
const User = require("../Schema/userschema");

const createUser = (req, res) => {
  const user = req.body;

  User.createUser(user, (err, result) => {
    if (err) {
      res.status(400).json({
        message: "Error creating user",
        error: err.message,
      });
    } else {
      res.status(201).json({
        message: "User created successfully",
        result: result,
      });
    }
  });
};

const getuser = (req, res) => {
  const sql = "SELECT * FROM user";
  Connection.query(sql, (err, results) => {
    if (err) {
      res.status(400).json({
        message: "Error creating user",
        error: err.message,
      });
    } else {
      res.status(201).json({
        message: "User created successfully",
        result: results,
      });
    }
  });
};

module.exports = {
  createUser,
  getuser,
};
