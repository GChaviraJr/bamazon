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
    queryManagerAction();
  });

function queryManagerAction() {
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
                console.log("starting viewProductsOnSale function")
                return viewProductsOnSale()
            case "VIEW_LOW_INVENTORY":
                console.log("starting newProduct function")
                return viewLowInventory()
            case "ADD_TO_INVENTORY":
                console.log("starting newProduct function")
                return addToInventory()
            case "ADD_NEW_PRODUCT":
                console.log("starting newProduct function")
                return newProduct()
            case "QUIT":
                return process.exit()
        }
    });
}

function viewProductsOnSale() {
    connection.query("SELECT * FROM products",
        function (err, res) {
            if (err) throw err
            console.log(res)
            queryManagerAction()
        }
    )
}

function viewLowInventory() {
    connection.query("SELECT item_id, product_name, stock_quantity FROM products ORDER BY stock_quantity ASC",
        function (err, res) {
            if (err) throw err
            console.log(res)
            queryManagerAction()
        }
    )
}

function addToInventory() {
    inquirer.prompt([{
        message: "Which item are we adding inventory to?",
        name: "item",
        type: "input",
    }, {
        message: "What is the amount of stock that is being added?",
        name: "added_stock",
        type: "input",
        validate(value) {
            return isNaN(value) === false;
        }
    }]).then(function (answers) {
        connection.query("SELECT item_id,product_name,price,stock_quantity FROM products WHERE ?", {
            item_id: answers.item
          }, function (err, res) {
              if (err) throw err
              let quantityDiff = parseInt(res[0].stock_quantity) + parseInt(answers.added_stock)
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
                function (err) {
                  if (err) throw err
                })
              console.log("Inventory updated. There are " + quantityDiff + " in inventory"),
                queryManagerAction()
            })
          })
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
            queryManagerAction()
        });
    });
}


exports.queryManagerAction = function() {
    return queryManagerAction()
  }