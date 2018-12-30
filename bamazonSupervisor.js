const mysql = require("mysql")
const inquirer = require("inquirer")
const cTable = require('console.table')

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
    querySupervisorAction();
  });

function querySupervisorAction() {
    inquirer.prompt({
        name: "action",
        type: "rawlist",
        message: "What would you like to do?",
        choices: ["View_Product_Sales_by_Department",
            "Create_New_Department",
            "QUIT"
        ]
    }).then(function (response) {
        switch (response.action) {
            case "View_Product_Sales_by_Department":
                console.log("starting View_Product_Sales_by_Department function")
                return viewDepartmentSales()
            case "Create_New_Department":
                console.log("starting Create_New_Department function")
                return addDepartment()
            case "QUIT":
                return process.exit()
        }
    });
}

function viewDepartmentSales() {
    connection.query("SELECT products.*, departments.* FROM products, departments WHERE products.item_id = departments.department_id",
     function (err, res) {
            if (err) throw err
             let totalProfitE = parseInt(res[0].over_head_costs) - parseInt(res[0].product_sales)
             let totalProfitC = parseInt(res[1].over_head_costs) - parseInt(res[1].product_sales)
            let table = cTable.getTable([
                {
                    department_id: res[0].department_id,
                    department_name: res[0].department_name,
                    over_head_costs: res[0].over_head_costs,
                    product_sales: res[0].product_sales,
                    total_profit: totalProfitE
                }, {
                    department_id: res[1].department_id,
                    department_name: res[1].department_name,
                    over_head_costs: res[1].over_head_costs,
                    product_sales: res[1].product_sales,
                    total_profit: totalProfitC
                }
            ])
            console.log(table)
            querySupervisorAction()
        }
    )
}

function addDepartment() {
    inquirer.prompt([{
        message: "What is the name of the new department?",
        name: "department_name",
        type: "input"
    }, {
        message: "What are the overhead costs of this department?",
        name: "over_head_costs",
        type: "input",
        validate(value) {
            return isNaN(value) === false
        }
    }]).then(function (answers) {

        connection.query("INSERT INTO departments SET ?", answers, function (error) {
            if (error) throw error;

            console.log("The new department was added successfully!")
            querySupervisorAction()
        });
    });
}


exports.querySupervisorAction = function() {
    return querySupervisorAction()
  }
exports.viewDepartmentSales = function() {
    return viewDepartmentSales()
}
exports.addDepartment = function() {
    return addDepartment()
}
