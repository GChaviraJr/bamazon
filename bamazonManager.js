const mysql = require("mysql")
const inquirer = require("inquirer")

const connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "Sb1598951",
  database: "bamazon"
})

function queryUserAction() {
    inquirer.prompt({
      name: "action",
      type: "rawlist",
      message: "What would you like to do?",
      choices: ["VIEW_PRODUCTS_FOR_SALE", 
      "VIEW_LOW_INVENTORY", 
      "ADD_TO_INVENTORY",
      "ADD_NEW_PRODUCT",
      "QUIT"
    ]
    }).then(function (response) {
      switch (response.action) {
        case "VIEW_PRODUCTS_FOR_SALE":
          console.log("starting newProduct function")
          return newProduct()
        case "VIEW_LOW_INVENTORY":
          console.log("starting newProduct function")
          return newProduct()
        case "ADD_TO_INVENTORY":
          console.log("starting newProduct function")
          return newProduct()
        case "ADD_NEW_PRODUCT":
          console.log("starting newProduct function")
          return newProduct()
        case "QUIT":
          return process.exit()
      }
    });
  }