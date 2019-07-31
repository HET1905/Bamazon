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
    console.log(`\n--------------Supervisor View ---------------\n`);
    inquirer.prompt([{
        name: 'selectOption',
        type: 'list',
        choices: ['View Product Sales by Department', 'Create New Department', 'Exit'],
        message: 'What whould you like to do ? '
    }]).then(function (data) {
        console.log(`\nYou have selected : ${data.selectOption}`);
        let optionSelected = data.selectOption;
        switch (optionSelected) {
            case 'View Product Sales by Department':
                displayProcutByDept();
                break;
            case 'Create New Department':
                createNewDept();
                break;

            case 'Exit':
                connection.end();
        }
    });
}

function  displayProcutByDept(){
    let queryString = `SELECT department_id,department_name,over_head_costs,
                        ifnull(sum(product_sales),0) as SumOfProductSales ,
                        ifnull((sum(product_sales)-over_head_costs),0) as TotalProfit
                        FROM departments a
                        INNER JOIN products b
                        ON a.department_name = b.dept_name
                        GROUP BY department_name;`;
    connection.query(queryString,function(err,data){
        if(err){
            console.log(`Error in group by query : ${err}`);
        }
        console.log('\n----------- Product Sales Group By Department ---------------\n')
        console.table(data);
        loadFile();
    });
    
    
}

function createNewDept(){
    console.log(`\n--------You are going to create new department ---------------\n`);
    inquirer.prompt([
        {
            name:'deptName',
            type:'input',
            message:'Department Name : '
        },{
            name:'overHeadCost',
            type:'input',
            message: 'Over Head Coasts : '
        }
    ]).then(function(data){
        // console.log(data.productName + data.deptName);
        let queryString = `INSERT INTO departments SET ?`;
        connection.query(queryString,[{
            department_name:data.deptName,
            over_head_costs: data.overHeadCost
            
        }],function(err,res){
            if(err){
                console.log(`Error in inserting data in table ${err}`);
            }
            console.log(`\n------------------------------------\n`)
            console.log("Department successfully added to table");
            loadFile();
        });
        // connection.end();
    });
}

// department_id	department_name	over_head_costs	product_sales	total_profit
// 01	Electronics	10000	20000	10000
// 02	Clothing	60000	100000	40000