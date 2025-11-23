CREATE TABLE roles (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) NOT NULL UNIQUE
);


INSERT INTO roles (name) VALUES
  ('admin'),
  ('advanced'),
  ('simple');

select * from users;


SELECT column_name 
FROM information_schema.columns 
WHERE table_name = 'users';


select * from roles;


SELECT * FROM clients;
SELECT id, name, price, quantity FROM products;

-- ADMIN
INSERT INTO users (username, password, role_id)
VALUES ('nora', crypt('nora123', gen_salt('bf')), 1);

-- ADVANCED USER
INSERT INTO users (username, password, role_id)
VALUES ('bini', crypt('bini123', gen_salt('bf')), 2);

-- SIMPLE USER
INSERT INTO users (username, password, role_id)
VALUES ('cali', crypt('cali123', gen_salt('bf')), 3);


SELECT column_name
FROM information_schema.columns
WHERE table_name = 'orders';


SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'orders';

SELECT * FROM order_items;
SELECT * FROM orders;

SELECT * FROM users;
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'order_items';

SELECT id, name, quantity FROM products;


SELECT * FROM clients;

SELECT * FROM sizes;

select * from products;


SELECT * FROM orders ORDER BY id DESC;
SELECT * FROM order_items WHERE order_id = 3;

SELECT * FROM order_items ORDER BY id DESC;


SELECT * FROM orders;
SELECT * FROM order_items WHERE order_id =1;
SELECT * FROM clients;




SELECT id, status FROM orders WHERE id = 5;
