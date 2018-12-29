const mysql = require("mysql")
const inquirer = require("inquirer")

const connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "Sb1598951",
  database: "bamazon"
})


connection.connect(function(err) {
  if (err) throw err
  queryUserAction();
});

// function which prompts the user for what action they should take
function queryUserAction() {
  inquirer.prompt({
    name: "action",
    type: "rawlist",
    message: "What would you like to do?",
    choices: ["BUY", "ADD_ITEM", "QUIT"]
  }).then(function(response) {
    switch (response.action) {
    case "BUY":
      return purchaseItem();
    case "ADD_ITEM":
      return newProduct();
    case "QUIT":
      return process.exit();
    }
  });
}


function newProduct() {
  inquirer.prompt([{
    message: "What is the item you would like to add?",
    name: "item_name",
    type: "input"
  }, {
    message: "What department would your item be placed in?",
    name: "department",
    type: "input"
  }, {
    message: "What is the price of the product?",
    name: "price",
    type: "input",
    validate(value) { return isNaN(value) === false; }
  }, {
      message: "What is the stock quantity of the product?",
      name: "stock",
      type: "input",
      validate(value) { return isNaN(value) === false; }
  }]).then(function(answers) {

    connection.query("INSERT INTO products SET ?", answers, function(error) {
      if (error) throw error;

      console.log("Your item was added successfully!");
      queryUserAction();
    });
  });
}

function purchaseItem() {
  connection.query("SELECT * FROM products", function(err, results) {
    if (err) throw err;

    inquirer.prompt([{
      choices() { return results.map(result => result.item_name || result.item_id); },
      message: "What item would you like to purchase?",
      name: "choice",
      type: "rawlist"
    }, {
      message: "How many of the selected item would you like to purchase?",
      name: "quantity",
      type: "input"
    }]).then(function(answers) {
      var chosenItem = results.find(function(result) {
        return result.item_name === answers.choice;
      });

      if (chosenItem.stock_quantity < parseInt(answers.quantity)) {
        connection.query("UPDATE auctions SET ? WHERE ?", [
          { stock_quantity: answers.quantity },
          { item_id: chosenItem.item_id }
        ],
        function(error) {
          if (error) throw err;
          console.log("Thank you for your order!");
          queryUserAction();
        });
      } else {
        console.log("Not enought stock to purchase, please try again...");
        queryUserAction();
      }
    });
  });
}
