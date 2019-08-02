var inquirer = require("inquirer");
var mysql = require("mysql");
// var columnify = require('columnify');

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "password",
    database: "bamazon"
});

connection.connect(function (err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);
    //   afterConnection();
    // connection.end();
    displayProducts();

});

var displayProducts = function () {
    connection.query('SELECT * FROM products', function (err, records) {
        // console.log(records);
        console.table(records, ['item_id', 'product_name', 'price']);
        buyItem();
    });
    // connection.end();
}

var buyItem = function () {
    inquirer.prompt([{
            name: 'itemId',
            type: 'input',
            message: 'Enter the Item Id of Product you want to buy : '
        },
        {
            name: 'qty',
            type: 'input',
            message: 'How many units you want to buy'
        }
    ]).then(function (data) {

        var itemId = data.itemId;
        var qty = data.qty;
        console.log('------------------------');

        var queryString = 'SELECT * FROM products WHERE item_id=' + itemId;
        connection.query(queryString, function (err, result) {
            // console.log(result);
            if (err) {
                console.log('Error in fetching records from table ' + err);
            }
            if (parseInt(result[0].stock_quantity) >= parseInt(qty)) {
                console.log('\n You have orderd : ' + result[0].product_name);
                console.log("Item id : " + itemId);
                console.log("Item qty : " + qty);
                console.log("Order Placed Successfully");
                var newQty = parseInt(result[0].stock_quantity) - parseInt(qty);
                
                var price = parseInt(qty) * parseInt(result[0].price);
                
                var prod_sales = parseInt(result[0].product_sales) + price;
                console.log('--------------------------');
                console.log('Total Price for your order : ' + price );

                connection.query('UPDATE products SET stock_quantity = ?,product_sales=? WHERE item_id= ?',[newQty,prod_sales,itemId],function(err,res){
                    if(err){
                        console.log('Error in updaing table : ' + err);
                    }
                    console.log('\nTable updated successfully');

                });
                connection.end();
               
            } else {
                console.log(result[0].product_name + ' - We don\'t have enough in stock, Insufficent Qty ');
                connection.end();
            }
        });
        

    });

}