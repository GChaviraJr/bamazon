const mysql = require("mysql");

const connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "Sb1598951",
  database: "bamazon"
})

connection.connect(function(err) {
  if (error) throw error
  console.log("connected as id " + connection.threadId)
  afterConnection()
})

function afterConnection() {
  connection.query("SELECT * FROM products", function(err, res) {
    if (error) throw error
    console.log(response)
    connection.end()
  })

