const mysql = require("mysql")
const inquirer = require("inquirer")
const cTable = require('console.table')
const customer = require("./bamazonCustomer")
const manager = require("./bamazonManager")
const supervisor = require("./bamazonSupervisor")



const connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "Sb1598951",
  database: "bamazon"
})


connection.connect(function (err) {
  if (err) throw err
  console.log("Connection Complete")
  pickUser();
});

function pickUser() {
    inquirer.prompt({
      name: "action",
      type: "rawlist",
      message: "Which type of user are you?",
      choices: ["CUSTOMER", 
      "MANAGER",
      "SUPERVISOR", 
      "QUIT"]
    }).then(function (response) {
      switch (response.action) {
        case "CUSTOMER":
          console.log("starting purchaseItem function")
          return customer.queryUserAction()
        case "MANAGER":
          console.log("starting purchaseItem function")
          return manager.queryManagerAction()
        case "SUPERVISOR":
          console.log("starting purchaseItem function")
          return supervisor.querySupervisorAction()
        case "QUIT":
          return process.exit()
      }
    });
  }