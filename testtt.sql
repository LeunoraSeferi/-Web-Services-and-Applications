SELECT * FROM clients;

SELECT * FROM users WHERE username='admin';

SELECT o.id, o.client_id, c.full_name AS client_name, o.order_date, o.status
FROM orders o
JOIN clients c ON o.client_id = c.id;

SELECT oi.id, oi.order_id, p.name AS product_name, oi.quantity, oi.price, (oi.quantity * oi.price) AS total_price
FROM order_items oi
JOIN products p ON oi.product_id = p.id;

SELECT o.id AS order_id, c.full_name AS client_name,
       SUM(oi.quantity * oi.price) AS order_total,
       o.status, o.order_date
FROM orders o
JOIN clients c ON o.client_id = c.id
JOIN order_items oi ON oi.order_id = o.id
GROUP BY o.id, c.full_name, o.status, o.order_date;



SELECT id, username, role_id FROM users ORDER BY id;

SELECT id, name FROM products;

