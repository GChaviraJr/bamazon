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
  console.log("Connection Complete")
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
      console.log("starting purchaseItem function")
      return purchaseItem()
    case "ADD_ITEM":
    console.log("starting newProduct function")
      return newProduct()
    case "QUIT":
      return process.exit()
    }
  });
}


function newProduct() {
  inquirer.prompt([{
    message: "What is the item you would like to add?",
    name: "product_name",
    type: "input"
  }, {
    message: "What department would your item be placed in?",
    name: "department_name",
    type: "input"
  }, {
    message: "What is the price of the product?",
    name: "price",
    type: "input",
    validate(value) { return isNaN(value) === false; }
  }, {
      message: "What is the stock quantity of the product?",
      name: "stock_quantity",
      type: "input",
      validate(value) { return isNaN(value) === false; }
  }]).then(function(answers) {

    connection.query("INSERT INTO products SET ?", answers, function(error) {
      if (error) throw error;

      console.log("Your item was added successfully!")
      queryUserAction()
    });
  });
}

function purchaseItem() {
  connection.query("SELECT * FROM products", function(err, results) {
    if (err) throw err;
    console.log(results)
    
    inquirer.prompt([{
      message: "What item would you like to purchase? Please Enter the item number.",
      name: "item_id",
      type: "input",
      validate(value) { return isNaN(value) === false; }
    }, {
      message: "How many of the selected item would you like to purchase?",
      name: "stock_quantity",
      type: "input",
      validate(value) { return isNaN(value) === false; }
    }]).then(function(answers) {
      var chosenItem;
        for (var i = 0; i < results.length; i++) {
          if (results[i].product_name === answers.item_id) {
            chosenItem = results[i];
          }
        }
      if (results.stock_quantity < parseInt(answers.stock_quantity)) {
        connection.query("UPDATE products SET ? WHERE ?", [
          { stock_quantity: chosenItem.stock_quantity },
          { item_id: chosenItem.item_id }
        ],
        function(error) {
          if (error) throw err;
          console.log("Not enought stock to purchase, please try again...");
          queryUserAction()
        });
      } else {
        console.log("Your order total costs" + chosenItem.price + "." +
        "Thank you for your order!")
        queryUserAction()
      }
    })
  })
}
