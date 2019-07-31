create database Bamazon;
use Bamazon;
CREATE TABLE Products (
	item_id INTEGER AUTO_INCREMENT NOT NULL,
    product_name VARCHAR(100),
	dept_name VARCHAR(50),
    price INTEGER,
    stock_quantity INTEGER,
    PRIMARY KEY(item_id)
    
);
INSERT INTO Products(product_name,dept_name,price,stock_quantity) 
VALUES ('NoteBooks','Kids',1,1500)
