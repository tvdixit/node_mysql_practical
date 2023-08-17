const mysql = require("mysql2");
const Connection = require("../config/db");

const createUser = (user, callback) => {
  const sql =
    "INSERT INTO user (first_name, last_name, email, password) VALUES (?, ?, ?, ?)";
  const values = [
    user.first_name,
    user.last_name,
    user.email,
    user.password,
    user.created_date,
  ];

  Connection.query(sql, values, (err, result) => {
    if (err) {
      callback(err, null);
    } else {
      callback(null, result);
    }
  });
};

module.exports = {
  createUser,
};
