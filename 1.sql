
-- Run this DDL (Data Definition Language) in pgAdmin 4's Query Tool 
-- against your 'store_db' database.


-- 1. Create the Users Table
-- NOTE: PostgreSQL uses SERIAL for auto-incrementing primary keys
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE
);

-- 2. Create the Categories Table
CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    description TEXT
);

-- 3. Create the Products Table
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    price NUMERIC(10, 2) NOT NULL, -- PostgreSQL uses NUMERIC for decimal types
    category_id INT NOT NULL,
    -- Foreign Key constraint to link products to categories
    CONSTRAINT fk_category
        FOREIGN KEY(category_id)
        REFERENCES categories(id)
        ON DELETE RESTRICT
);

-- 4. Sample Data Inserts
INSERT INTO categories (name, description) VALUES
('Electronics', 'Devices and gadgets'),
('Clothing', 'Apparel and accessories'),
('Home & Kitchen', 'Appliances and tools for home');

INSERT INTO products (name, description, price, category_id) VALUES
('Smartphone', 'Latest model smartphone with high resolution camera', 699.99, 1),
('Laptop', 'Lightweight laptop with powerful performance', 999.99, 1),
('T-Shirt', 'Cotton t-shirt available in multiple colors', 19.99, 2),
('Coffee Maker', 'Brews coffee in minutes with programmable settings', 49.99, 3);