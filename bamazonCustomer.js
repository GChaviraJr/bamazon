const mysql = require("mysql")
const inquirer = require("inquirer")

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

// connect to the mysql server and sql database
connection.connect(function(err) {
  if (err) throw err;
  // run the start function after the connection is made to prompt the user
  start();
});

// function which prompts the user for what action they should take
function start() {
  inquirer
  .prompt({
    name: "purchaseOrAddItem",
    type: "rawlist",
    message: "Would you like to purchase a product or would you like to add a product?",
    choices: ["Purchase", "Add Item"]
  })
  .then(function(answer) {
    if (answer.purchaseOrAddItem === "Purchase") {
      purchaseItem();
    }
    else {
      newProduct();
    }
    });
}

// function to handle posting new items up for auction
function newProduct() {
  // prompt for info about the item being put up for auction
  inquirer
    .prompt([
      {
        name: "item",
        type: "input",
        message: "What is the item you would like to submit?"
      },
      {
        name: "department",
        type: "input",
        message: "What department does the product belong in?"
      },
      {
        name: "quantity",
        type: "input",
        message: "What is the quantity of the product?",
        validate: function(value) {
          if (isNaN(value) === false) {
            return true;
          }
          return false;
        }
      }
    ])
    .then(function(answer) {
      // when finished prompting, insert a new item into the db with that info
      connection.query(
        "INSERT INTO products SET ?",
        {
          item_name: answer.item,
          department: answer.department,
          stock_quantity: answer.quantity,
        },
        function(err) {
          if (err) throw err;
          console.log("Your items were added successfully!");
          // re-prompt the user for if they want to add additional items
          start();
        }
      );
    });
}

function purchaseItem() {
  // query the database for all items on sale
  connection.query("SELECT * FROM products", function(err, results) {
    if (err) throw err;
    // once you have the items, prompt the user for which they'd like purchase
    inquirer
      .prompt([
        {
          name: "choice",
          type: "rawlist",
          choices: function() {
            let choiceArray = [];
            for (let i = 0; i < results.length; i++) {
              choiceArray.push(results[i].item_id);
            }
            return choiceArray;
          },
          message: "Which item would you like to purchase?"
        },
        {
          name: "stock",
          type: "input",
          message: "How many would you like to purchase?"
        }
      ])
      .then(function(answer) {
        // get the information of the chosen item
        let chosenItem;
        for (let i = 0; i < results.length; i++) {
          if (results[i].item_name === answer.choice) {
            chosenItem = results[i];
          }
        }

        // determine if theres enough stock of the item
        if (chosenItem.stock_quantity < parseInt(answer.stock_quantity)) {
          // item has been chosen so update db, let the user know, and start over
          connection.query(
            "UPDATE products SET ? WHERE ?",
            [
              {
                stock_quantity: answer.stock
              },
              {
                item_id: chosenItem.item_id
              }
            ],
            function(error) {
              if (error) throw err;
              console.log("Your purchase is successful!");
              start();
            }
          );
        }
        else {
          console.log("The stock is too low, please try again...");
          start();
        }
      });
  });
}
