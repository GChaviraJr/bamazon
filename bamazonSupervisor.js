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
    connection.query("SELECT department_id,department_name,over_head_costs,product_sales FROM departments,products",
     function (err, res) {
            if (err) throw err
            let totalProfit = parseInt(res[0].over_head_costs) - parseInt(res[0].product_sales)
            let total = res[0].price * answers.stock
            console.log(res)
            querySupervisorAction()
        }
    )
}
