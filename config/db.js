const mysql = require("mysql");

const Connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "node_mysql_practical",
});

Connection.connect((err) => {
  if (err) throw err;
  console.log("Database Connected !");
});

module.exports = Connection;
