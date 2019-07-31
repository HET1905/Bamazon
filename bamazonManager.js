var inquirer = require('inquirer');
var mysql = require('mysql');

var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    port: 3306,
    password: 'password',
    database: 'bamazon'
});

connection.connect(function (err) {
    if (err) throw err;
    console.log(`Connected made ! Thread id : ${connection.threadId}`);
    loadFile();

    // connection.end();
})

function loadFile() {
    console.log(`\n--------------Manager's View ---------------\n`);
    inquirer.prompt([{
        name: 'selectOption',
        type: 'list',
        choices: ['View Products for Sale', 'View Low Inventory', 'Add to Inventory', 'Add New Product','Exit'],
        message: 'What whould you like to do ? '
    }]).then(function (data) {
        console.log(`\nYou have selected : ${data.selectOption}`);
        let optionSelected = data.selectOption;
        switch (optionSelected) {
            case 'View Products for Sale':
                displayAllProducts();
                break;
            case 'View Low Inventory':
                displayLowInventory();
                break;
            case 'Add to Inventory':
                addToInventory();
                break;
            case 'Add New Product':
                addNewProduct();
                break;
            case 'Exit':
                connection.end();
        }
    });
}
// If a manager selects View Products for Sale, the app should list every available item: 
// the item IDs, names, prices, and quantities.
function displayAllProducts() {
    let queryString = `SELECT item_id as ItemID, product_name as ProductName, price as Price,stock_quantity as Quantities
                         FROM products`;
    connection.query(queryString, function (err, data) {
        if (err) {
            console.log(`Error in getting data from Products table : ${err}`);
        }
        console.log(`\n----------------Displaying All Products --------------\n`)
        console.table(data);
        loadFile();
        // connection.end();
    });
}
// If a manager selects View Low Inventory, then it should list all items with an inventory count lower than five.
function displayLowInventory() {
    let queryString = `SELECT item_id as ItemID, product_name as ProductName,dept_name as DeptName, price as Price,
                        stock_quantity as Quantities FROM products WHERE stock_quantity<5`;
    connection.query(queryString, function (err, data) {
        if (err) {
            console.log(`Error in getting data for inventory less than 5 : ${err}`);
        }
        console.log(`\n-------------Displaying Low Inventory Records -----------------\n`)
        console.table(data);
        loadFile();
        // connection.end();
        
    });
}


// If a manager selects Add to Inventory, your app should display a prompt that will let 
// the manager "add more" of any item currently in the store.
function addToInventory() {
    console.log(`\n-------------Adding to Quantity------------------\n`)
    inquirer.prompt([{
            name: 'itemId',
            type: 'input',
            message: 'Enter the Item ID: '
        },
        {
            name: 'qty',
            type: 'input',
            message: 'Enter the Quantity you want to add'
        }
    ]).then(function (data) {
        console.log(`---------------------------\n`);
        console.log(`You want to add quantity on Item ID : ${data.itemId} increase Qty by ${data.qty}. `);
        let newQty = 0;
        let seletString = `Select * from products where item_id=${data.itemId}`;
        connection.query(seletString, function (err, rec) {
            if (err) {
                console.log('Error in getting data by item_id : ' + err)
            };
            newQty = parseInt(rec[0].stock_quantity) + parseInt(data.qty);
            console.log("\n After adding the new Qty  will be : " + newQty);

            let queryString = `UPDATE products SET stock_quantity = ? WHERE item_id=?`;
            connection.query(queryString, [newQty, data.itemId], function (err, res) {
                if (err) {
                    console.log(`Error in updating table to add qty : ${err}`);
                }
                console.log(`--------------------------------------------`);
                console.log(`\nQuantity added to the table successfully ....`);
                loadFile();
            });
            // connection.end();
        });

        
    });
}


// If a manager selects Add New Product, it should allow the manager to add a completely new product to the store.

function addNewProduct(){
    console.log(`\n--------You are going to add new Product ---------------\n`);
    inquirer.prompt([
        {
            name:'productName',
            type:'input',
            message:'Product Name : '
        },{
            name:'deptName',
            type:'input',
            message: 'Department Name : '
        },{
            name:'price',
            type:'input',
            message:'Price : '
        },{
            name:'Qty',
            type:'input',
            message:'Stock Quantity : '
        }
    ]).then(function(data){
        // console.log(data.productName + data.deptName);
        let queryString = `INSERT INTO products SET ?`;
        connection.query(queryString,[{
            product_name:data.productName,
            dept_name: data.deptName,
            stock_quantity:data.Qty,
            price:data.price
        }],function(err,res){
            if(err){
                console.log(`Error in inserting data in table ${err}`);
            }
            console.log(`\n------------------------------------\n`)
            console.log("Product successfully added to table");
            loadFile();
        });
        // connection.end();
    });
}