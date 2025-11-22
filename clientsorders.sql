-- create a client linked to admin user
INSERT INTO clients (user_id, full_name, email, phone, address)
VALUES (
  (SELECT id FROM users WHERE username='admin' LIMIT 1),
  'Admin Test Client',
  'nora@example.com',  
  '123456789',
  '123 Test Street'
)
RETURNING id;

--create an order for that client
INSERT INTO orders (client_id, status)
VALUES (
  (SELECT id FROM clients WHERE email='nora@example.com' LIMIT 1),
  'Pending'
)
RETURNING id;

--insert one order item (use price from products)
INSERT INTO order_items (order_id, product_id, quantity, price)
VALUES (
  (SELECT id FROM orders WHERE client_id=(SELECT id FROM clients WHERE email='nora@example.com') LIMIT 1),
  (SELECT id FROM products WHERE name='Nike White Tee' LIMIT 1),
  2,
  (SELECT price FROM products WHERE name='Nike White Tee' LIMIT 1)
)
RETURNING *;


SELECT * FROM clients;
SELECT * FROM orders;


SELECT o.id AS order_id, c.full_name AS client_name,
       SUM(oi.quantity*oi.price) AS total_amount,
       o.status
FROM orders o
JOIN clients c ON o.client_id = c.id
JOIN order_items oi ON oi.order_id = o.id
GROUP BY o.id, c.full_name, o.status;


SELECT * FROM users WHERE username='admin2'

-- Create Admin2 client linked to admin user
INSERT INTO clients (user_id, full_name, email, phone, address)
VALUES (
  (SELECT id FROM users WHERE username='admin2' LIMIT 1),
  'Admin2 Test Client',
  'admin2@hotmail.com',
  '222333444',
  '456 Test Avenue'
)
RETURNING id;

--Create an order for Admin2 client
INSERT INTO orders (client_id, status)
VALUES (
  (SELECT id FROM clients WHERE email='admin2@hotmail.com' LIMIT 1),
  'Pending'
)
RETURNING id;

-- Insert one order item for Admin2 client (e.g., Adidas Windbreaker)
INSERT INTO order_items (order_id, product_id, quantity, price)
VALUES (
  (SELECT id FROM orders WHERE client_id=(SELECT id FROM clients WHERE email='admin2@hotmail.com') LIMIT 1),
  (SELECT id FROM products WHERE name='Adidas Windbreaker' LIMIT 1),
  1,
  (SELECT price FROM products WHERE name='Adidas Windbreaker' LIMIT 1)
)
RETURNING *;


--TESTS
-- Check clients
SELECT * FROM clients WHERE email='admin2@hotmail.com';

-- Check orders
SELECT * FROM orders WHERE client_id=(SELECT id FROM clients WHERE email='admin2@hotmail.com');

-- Check order items
SELECT oi.id, o.id AS order_id, c.full_name AS client_name, p.name AS product_name,
       oi.quantity, oi.price, (oi.quantity*oi.price) AS total_price
FROM order_items oi
JOIN orders o ON oi.order_id = o.id
JOIN clients c ON o.client_id = c.id
JOIN products p ON oi.product_id = p.id
WHERE c.email='admin2@hotmail.com';

-- Check total amount for Admin2 order
SELECT o.id AS order_id, c.full_name AS client_name,
       SUM(oi.quantity*oi.price) AS total_amount,
       o.status
FROM orders o
JOIN clients c ON o.client_id = c.id
JOIN order_items oi ON oi.order_id = o.id
WHERE c.email='admin2@hotmail.com'
GROUP BY o.id, c.full_name, o.status;

