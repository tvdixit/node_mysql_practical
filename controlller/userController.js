const Connection = require("../config/db");
const User = require("../Schema/userschema");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const SecretKey = "yourSecretKey";

const createUser = async (req, res) => {
  const existingUser = ("SELECT * FROM user WHERE email = ?", [req.body.email]);
  if (existingUser) {
    return res.status(409).json({ message: "Email is already taken." });
  }
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);
  const user = {
    ...req.body,
    password: hashedPassword,
  };
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

const Login = (req, res) => {
  const { email, password } = req.body;
  const sql = "SELECT * FROM user WHERE email =? AND password =?";
  Connection.query(sql, [email, password], (err, results) => {
    if (err) {
      res.status(400).json({
        message: "Error user login",
        error: err.message,
      });
    } else {
      if (results.length > 0) {
        const user = results[0];
        const token = jwt.sign({ userId: user.id }, SecretKey, {
          expiresIn: "1h",
        });

        res.status(200).json({
          message: "Login successful",
          token: token,
        });
      } else {
        res.status(401).json({
          message: "Invalid credentials",
        });
      }
    }
  });
};

module.exports = {
  createUser,
  getuser,
  Login,
};
