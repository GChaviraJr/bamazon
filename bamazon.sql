-- DROP DATABASE IF EXISTS bamazon;
-- CREATE DATABASE bamazon;

-- USE bamazon;

-- CREATE TABLE products(
--   item_id INT NOT NULL AUTO_INCREMENT,
--   product_name VARCHAR(100) NOT NULL,
--   department_name VARCHAR(45) NOT NULL,
--   price INT default 0,
--   stock_quantity INT default 0,
--   PRIMARY KEY (item_id)
-- );


-- USE bamazon;

-- INSERT INTO products (product_name, department_name, price, stock_quantity)
-- VALUES 
-- ("Echo Dot Gen 3", "Electronics",  29.99, 25),
-- ("Google Home", "Electronics",  99.99, 20),
-- ("Apple HomePod", "Electronics",  349.99, 35),
-- ("Philips Hue A19 Starter Pack", "Electronics",  129.99, 22),
-- ("Philips Hue Color A19 Starter Pack", "Electronics",  179.99, 20),
-- ("August Smart Lock 3rd Gen", "Electronics",  124.50, 30),
-- ("Nest Learning Thermostat", "Electronics",  214.99, 29),
-- ("Ring Floodlight Camera", "Electronics",  249.99, 24),
-- ("Ring Alarm Home Security System", "Electronics",  24.99, 38),
-- ("Amazon Smart Plug", "Electronics",  24.99, 26)
-- ;
--  

USE bamazon;

SELECT * FROM products;


