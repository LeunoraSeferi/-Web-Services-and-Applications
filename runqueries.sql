
4--Useful queries to check data
--List all products with category/brand names

SELECT p.id, p.name, p.description, p.price, p.quantity,
       c.name AS category, b.name AS brand, s.size AS size, col.color AS color, g.type AS gender
FROM products p
LEFT JOIN categories c ON p.category_id = c.id
LEFT JOIN brands b ON p.brand_id = b.id
LEFT JOIN sizes s ON p.size_id = s.id
LEFT JOIN colors col ON p.color_id = col.id
LEFT JOIN gender g ON p.gender_id = g.id;


--Get total earnings
SELECT COALESCE(SUM(price * quantity),0) AS total_earnings FROM order_items;

-- Top selling products
SELECT p.id, p.name, SUM(oi.quantity) AS total_sold
FROM order_items oi
JOIN products p ON oi.product_id = p.id
GROUP BY p.id, p.name
ORDER BY total_sold DESC
LIMIT 5;

-- Top selling products with total earnings
SELECT p.id, p.name,
       SUM(oi.quantity) AS total_sold,
       SUM(oi.quantity * oi.price) AS total_earnings
FROM order_items oi
JOIN products p ON oi.product_id = p.id
GROUP BY p.id, p.name
ORDER BY total_sold DESC
LIMIT 5;


--- top-selling products query again
SELECT p.id, p.name,
       SUM(oi.quantity) AS total_sold,
       SUM(oi.quantity * oi.price) AS total_earnings
FROM order_items oi
JOIN products p ON oi.product_id = p.id
GROUP BY p.id, p.name
ORDER BY total_sold DESC
LIMIT 5;

