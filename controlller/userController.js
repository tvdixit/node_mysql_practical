const Connection = require("../config/db");
const User = require("../Schema/userschema");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();
// CreateUser api :
const createUser = async (req, res) => {
  const existingUser = `SELECT * FROM user WHERE email = ?`;

  Connection.query(existingUser, [req.body.email], async (err, results) => {
    const countData = results.length;
    if (countData > 0) {
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
  });
};
//Get User API :
const getuser = (req, res) => {
  const lang = req.query.lang;

  if (lang === "fr") {
    req.setLocale("fr");
  } else {
    req.setLocale("en");
  }
  const sql = "SELECT * FROM user";
  Connection.query(sql, (err, results) => {
    if (err) {
      const errorMessage = req.__("Error fetching users");
      res.status(400).json({ message: errorMessage, error: err.message });
    } else {
      const successMessage = req.__("Users fetched successfully");
      res.status(200).json({ message: successMessage, result: results });
    }
  });
};
// Login Api :
const Login = (req, res) => {
  const { email, password } = req.body;
  const sql = "SELECT * FROM user WHERE email = ?";

  Connection.query(sql, [email], async (err, results) => {
    if (err) {
      res.status(500).json({ message: "Error user login", error: err.message });
    } else {
      if (results.length > 0) {
        const user = results[0];
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        console.log(user.id, "id");

        if (!isPasswordMatch) {
          res.status(401).json({ message: "password not match" });
        }
        const token = jwt.sign({ userId: user.id }, process.env.SecretKey, {
          expiresIn: "24h",
        });
        res.status(200).json({ status: true, auth: token });
      } else {
        res.status(401).json({ message: "Invalid credentials" });
      }
    }
  });
};

module.exports = {
  createUser,
  getuser,
  Login,
};
