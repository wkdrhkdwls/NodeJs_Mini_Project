const mysql = require("mysql2");

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "youtube",
  dateStrings: true,
});

// connection.query("SELECT * FROM `users`", function (err, results, fields) {
//   let { id, email, name, created_at } = results[0];
//   console.log(id);
//   console.log(email);
//   console.log(name);
//   console.log(created_at);
// });

module.exports = connection;
