const mysql = require("mysql");

const Connection = mysql.createConnection({
  host: process.env.host,
  user: "root",
  password: "",
  database: "node_mysql_practical",
});

Connection.connect((err) => {
  if (err) throw err;
  console.log("Database Connected !");
});

module.exports = Connection;
