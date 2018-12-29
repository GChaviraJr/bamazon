const mysql = require("mysql")
const inquirer = require("inquirer")

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
  queryUserAction();
});

// function which prompts the user for what action they should take
function queryUserAction() {
  inquirer.prompt({
    name: "action",
    type: "rawlist",
    message: "What would you like to do?",
    choices: ["BUY", "ADD_ITEM", "QUIT"]
  }).then(function (response) {
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
    validate(value) {
      return isNaN(value) === false;
    }
  }, {
    message: "What is the stock quantity of the product?",
    name: "stock_quantity",
    type: "input",
    validate(value) {
      return isNaN(value) === false;
    }
  }]).then(function (answers) {

    connection.query("INSERT INTO products SET ?", answers, function (error) {
      if (error) throw error;

      console.log("Your item was added successfully!")
      queryUserAction()
    });
  });
}


function purchaseItem() {
  inquirer.prompt([{
    message: "What item would you like to purchase? Please Enter the item number.",
    name: "item",
    type: "input",
    validate(value) {
      return isNaN(value) === false;
    }
  }, {
    message: "How many of the selected item would you like to purchase?",
    name: "stock",
    type: "input",
    validate(value) {
      return isNaN(value) === false;
    }
  }]).then(function (answers) {
    connection.query("SELECT item_id,product_name,price,stock_quantity FROM products WHERE ?", {
      item_id: answers.item
    }, function (err, results) {
      if (parseInt(answers.stock) > results[0].stock_quantity) {
        console.log("sorry, there are only " + results[0].stock_quantity + " left")
        purchaseItem()
      } else {
        let total = results[0].price * answers.stock
        console.log("Your purchase of " + answers.stock + " " + results[0].product_name + " total cost is: $ " + parseInt(total))
        let quantityDiff = results[0].stock_quantity - answers.stock
        console.log(quantityDiff)
        connection.query(
          "UPDATE products SET ? WHERE ?",
          [{
              stock_quantity: quantityDiff
            },
            {
              item_id: answers.item
            }
          ],
          function (error) {
            if (error) throw err
          })
        console.log("Inventory updated. There are " + quantityDiff + " left"),
          console.log(results),
          queryUserAction()
      }
    })
  })
}